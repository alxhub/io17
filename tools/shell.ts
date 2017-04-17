import 'reflect-metadata';
import 'zone.js/dist/zone-node.js';

import {enableProdMode, NgModule, NgModuleFactory, NgModuleFactoryLoader, ReflectiveInjector} from '@angular/core';
import {COMPILER_PROVIDERS, JitCompiler, ResourceLoader} from '@angular/compiler';
import {ServerModule, renderModuleFactory} from '@angular/platform-server';

import * as fs from 'fs';
import * as path from 'path';

function relToAbs(file: string): string {
  if (path.isAbsolute(file)) {
    return file;
  }
  return path.normalize(path.join(process.cwd(), file));
}

const fileModule = relToAbs(process.argv[2]);
const fileIndex = relToAbs(process.argv[3]);
const fileServerModule = process.argv.length > 4 ? relToAbs(process.argv[4]) : null;

const indexHtml = fs.readFileSync(fileIndex).toString();

const NG_MODULE_KEYS = ['providers', 'declarations', 'imports', 'exports', 'entryComponents', 'bootstrap', 'schemas', 'id'];


function hasNgModuleMetadata(value: any): boolean {
  if (typeof value !== 'function') {
    return false;
  }
  if (Reflect.getMetadataKeys(value).indexOf('annotations') === -1) {
    return false;
  }
  const annotations: any[] = Reflect.getMetadata('annotations', value);
  return annotations.some(annotation => Object.keys(annotation).every(key => NG_MODULE_KEYS.indexOf(key) !== -1));
}

function loadNgModule(modPath: string): any {
  const exported = require(modPath);
  const modules = Object
    .keys(exported)
    .filter(key => hasNgModuleMetadata(exported[key]));
  if (modules.length === 0) {
    throw new Error(`${modPath} contains no @NgModules`);
  } else if (modules.length > 1) {
    throw new Error(`${modPath} contains more than 1 @NgModule`);
  }
  return exported[modules[0]];
}

class FileLoader implements ResourceLoader {
  get(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(fs.readFileSync(url).toString());
    });
  }
}

const injector = ReflectiveInjector.resolveAndCreate([
  COMPILER_PROVIDERS,
  {provide: ResourceLoader, useValue: new FileLoader()}
]);

const compiler: JitCompiler = injector.get(JitCompiler);

class RequireNgModuleFactoryLoader implements NgModuleFactoryLoader {
  load(pathAndHash: string): Promise<NgModuleFactory<any>> {
    const [modPath, exportName] = pathAndHash.split('#');
    const relModPath = `../src/${modPath}`;
    const module = require(relModPath)[exportName];
    return compiler.compileModuleAsync(module);
  }
}

const moduleType = loadNgModule(fileModule);
let appServerModule = [];
if (fileServerModule) {
  appServerModule.push(loadNgModule(fileServerModule));
}

const annotations: any = Reflect.getMetadata('annotations', moduleType)[0];
const bootstrap = annotations.bootstrap;

@NgModule({
  bootstrap,
  imports: [
    ...appServerModule,
    moduleType,
    ServerModule,
  ],
  providers: [
    {provide: NgModuleFactoryLoader, useClass: RequireNgModuleFactoryLoader},
  ],
})
export class AppShellModule {}

enableProdMode();

compiler
  .compileModuleAsync(AppShellModule)
  .then(factory => renderModuleFactory(factory, {url: '/', document: indexHtml}))
  .then(html => console.log(html));
