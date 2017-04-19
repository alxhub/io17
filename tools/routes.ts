import {Injector, NgModule, NgZone, ReflectiveInjector} from '@angular/core';
import {Route, Routes, ROUTES} from '@angular/router';
import {platformServer, ServerModule} from '@angular/platform-server';
import {jitCompiler, loadNgModule} from './util';

function resolveLoadChildren(loadChildren: string|Function): any {
  if (typeof loadChildren === 'function') {
    return loadChildren();
  } else {
    const [moduleFile, moduleName] = loadChildren.split('#');
    return loadNgModule(`../src/${moduleFile}`, moduleName);
  }
}

function expandLazyChildrenOfRoute(route: Route, injector: Injector): Promise<Route> {
  if (!route.loadChildren) {
    return Promise.resolve(route);
  }
  const module = resolveLoadChildren(route['loadChildren']);
  return readRoutesForModule(module, injector)
    .then(childRoutes => {
      route.children = childRoutes;
      return route;
    });
}

function expandLazyChildren(routes: Routes, injector: Injector): Promise<Routes> {
  return Promise.all(routes
    .map(route => expandLazyChildrenOfRoute(route, injector))
  );
}

function flattenRoutes(routes: Route[][]): Route[] {
  return routes.reduce((acc, routes) => acc.concat(routes), [] as Route[]);
}

function readRoutesForModule(module: any, injector: Injector): Promise<Routes> {  
  return jitCompiler()
    .compileModuleAsync(module)
    .then(factory => factory.create(injector))
    .then(ref => {
      const routes = flattenRoutes(ref.injector.get(ROUTES));
      return expandLazyChildren(routes, ref.injector);
    });
}

export function routesForApp(module: any): Promise<Routes> {
  @NgModule({
    imports: [
      module,
      ServerModule,
    ],
  })
  class FakeServerModule {}

  const ngZone = new NgZone({enableLongStackTrace: false});
  const injector = ReflectiveInjector.resolveAndCreate([{provide: NgZone, useValue: ngZone}], platformServer().injector);

  return readRoutesForModule(FakeServerModule, injector);
}

export interface TerminalRoute {
  path: string;
  prefix: boolean;
  loadChildren: string[];
}

function coalesceRouteToTerminals(route: Route, prefixSegments: string[], loadChildren: string[]): TerminalRoute[] {
  if (!route.children || route.children.length === 0) {
    // Route is a terminal.
    return [{
      path: prefixSegments
        .filter(seg => seg !== '')
        .concat([route.path])
        .join('/'),
      prefix: route.pathMatch === 'prefix',
      loadChildren,
    }];
  } else {
    // Route is non-terminal.
    const newSegments = prefixSegments.concat([route.path]);
    const loadChildrenDir = (typeof route.loadChildren === 'string') ? route.loadChildren : null;
    const newLoadChildren = loadChildrenDir !== null ? loadChildren.concat([loadChildrenDir]) : loadChildren;
    return route
      .children
      .map(child => coalesceRouteToTerminals(child, newSegments, newLoadChildren))
      .reduce((acc, terminals) => acc.concat(terminals), []);
  }
}

export function coalesceRoutesToTerminals(routes: Route[]): TerminalRoute[] {
  return routes
    .map(route => coalesceRouteToTerminals(route, [], []))
    .reduce((acc, terminals) => acc.concat(terminals), []);
}

function regexForSegment(segment: string): {segment: string, pure: boolean} {
  if (segment.startsWith(':')) {
    return {segment: '[^/]+', pure: false};
  } else if (segment === '**') {
    return {segment: '.*', pure: false};
  } else {
    return {segment, pure: true};
  }
}

export function regexForTerminal(route: TerminalRoute): {pattern: string, match: string} {
  const body = route
    .path
    .split('/')
    .map(segment => regexForSegment(segment));
  const pattern = '/' + body.map(segment => segment.segment).join('/');
  if (body.every(segment => segment.pure)) {
    if (route.prefix) {
      return {pattern, match: 'prefix'};
    } else {
      return {pattern, match: 'exact'};
    }
  } else {
    const suffix = route.prefix ? '(/.*)?' : '';
    return {pattern: `^${pattern}${suffix}$`, match: 'regex'};
  }
}