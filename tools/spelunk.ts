import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

const sourceText = fs.readFileSync(process.argv[2]).toString();

const IS_CHUNK = /^[0-9]+\..*\.chunk\.js$/;

function name(node: ts.Node): string {
  return ts.SyntaxKind[node.kind];
}

function printAst(node: ts.Node, space: string): void {
  console.log(space, name(node));
  ts.forEachChild(node, child => {
    printAst(child, space + ' ');
  });
}

export interface ChunkMap {
  [module: string]: string;
}

function interpretRouteMap(map: ts.ObjectLiteralExpression, chunks: string[], dist: string): ChunkMap {
  let routes = {};
  map.properties.forEach(property => {
    const propAssign = property as ts.PropertyAssignment;
    const key = (propAssign.name as ts.StringLiteral).text;
    const value = (propAssign.initializer as ts.ArrayLiteralExpression);
    const index = value.elements[1] as ts.LiteralExpression;
    const chunkIndex = parseInt(index.text);
    routes[key] = findChunk(chunks, chunkIndex, dist);
  });
  return routes;
}

function keyIsModuleFactory(property: ts.ObjectLiteralElementLike): boolean {
  if (property.kind !== ts.SyntaxKind.PropertyAssignment) {
    return false;
  }
  const propExpr = property as ts.PropertyAssignment;
  if (propExpr.name.kind !== ts.SyntaxKind.StringLiteral) {
    return false;
  }
  if (propExpr.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    return false;
  }
  const value = propExpr.initializer as ts.ArrayLiteralExpression;
  if (value.elements.length !== 2) {
    return false;
  }
  if (value.elements[0].kind !== ts.SyntaxKind.StringLiteral) {
    return false;
  }
  if (value.elements[1].kind !== ts.SyntaxKind.FirstLiteralToken) {
    return false;
  }
  const name = propExpr.name as ts.StringLiteral;
  return name.text.endsWith('.ngfactory');
}

function keysAreModuleFactories(node: ts.ObjectLiteralExpression): boolean {
  return node
    .properties
    .every(property => keyIsModuleFactory(property));
}

function varStmtToValue(varStmt: ts.VariableStatement): ts.Expression|null {
  if (varStmt.declarationList.declarations.length !== 1) {
    return null;
  }
  return varStmt.declarationList.declarations[0].initializer;
}

function maybeGetRouteMapForModule(module: ts.Block): ts.ObjectLiteralExpression|null {
  const exprs = module
    .statements
    .filter(stmt => stmt.kind === ts.SyntaxKind.VariableStatement)
    .map((stmt: ts.VariableStatement) => varStmtToValue(stmt))
    .filter(node => node != null && node.kind === ts.SyntaxKind.ObjectLiteralExpression)
    .map(stmt => stmt as ts.ObjectLiteralExpression)
    .filter(stmt => keysAreModuleFactories(stmt));
  if (exprs.length === 0) {
    return null;
  } else if (exprs.length > 1) {
    throw new Error('Multiple route maps found');
  } else {
    return exprs[0];
  }
}

function routeMapFromSource(source: ts.SourceFile): ts.ObjectLiteralExpression|null {
  if (source.statements.length < 1) {
    throw new Error('No statements in bundle.');
  }
  if (source.statements[0].kind !== ts.SyntaxKind.ExpressionStatement) {
    throw new Error('Top-level statement is not expression.');
  }
  const webpackExpr = source.statements[0] as ts.ExpressionStatement;
  if (webpackExpr.expression.kind !== ts.SyntaxKind.CallExpression) {
    throw new Error('Top-level statement is not a call expression.');
  }
  const webpackCall = webpackExpr.expression as ts.CallExpression;
  if (webpackCall.arguments.length !== 3) {
    throw new Error('Webpack call does not have expected number of arguments.');
  }
  if (webpackCall.arguments[1].kind !== ts.SyntaxKind.ObjectLiteralExpression) {
    throw new Error('Webpack call does not have a module map as 2nd argument.');
  }
  const moduleMap = webpackCall.arguments[1] as ts.ObjectLiteralExpression;
  const modules: ts.Block[] = [];
  moduleMap.properties.forEach(child => {
    if (child.kind !== ts.SyntaxKind.PropertyAssignment) {
      throw new Error('Module map has non-property-assignment entry.');
    }
    const assignment = child as ts.PropertyAssignment;
    if (assignment.initializer.kind !== ts.SyntaxKind.FunctionExpression) {
      throw new Error('Module entry is not a function.');
    }
    const moduleFn = assignment.initializer as ts.FunctionExpression;
    modules.push(moduleFn.body);
  });

  const routeMaps = modules
    .map(module => maybeGetRouteMapForModule(module))
    .filter(routeMap => routeMap !== null);
  if (routeMaps.length === 0) {
    return null;
  } else if (routeMaps.length > 1) {
    throw new Error('More than one route map found.');
  } else {
    return routeMaps[0];
  }
}

function findChunk(chunks: string[], index: number, dist: string): string {
  const prefix = `${index}.`;
  const matches = chunks.filter(chunk => chunk.startsWith(prefix));
  if (matches.length === 0) {
    throw new Error(`No ${prefix}*.js found in ${dist}`);
  } else if (matches.length > 1) {
    throw new Error(`Too many ${prefix}*.js files found in ${dist}`);
  }
  return matches[0];
}

export function chunkMapForDist(dist: string): ChunkMap|null {
  const files = fs
    .readdirSync(dist)
    .filter(file => fs.statSync(path.join(dist, file)).isFile());
  const mains = files.filter(file => file.startsWith('main.') && file.endsWith('.js'));
  const chunks = files.filter(file => IS_CHUNK.test(file));
  if (mains.length === 0) {
    throw new Error(`No main.*.js found in ${dist}`);
  } else if (mains.length > 1) {
    throw new Error(`Too many main.*.js files found in ${dist}`);
  }
  const sourceText = fs.readFileSync(path.join(dist, mains[0])).toString();
  const source = ts.createSourceFile(process.argv[2], sourceText, ts.ScriptTarget.ES5, false, ts.ScriptKind.JS);
  const map = routeMapFromSource(source);
  if (map === null) {
    return null;
  }
  return interpretRouteMap(map, chunks, dist);
}
