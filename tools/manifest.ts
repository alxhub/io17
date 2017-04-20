import * as fs from 'fs';
import * as path from 'path';
import sha1_raw = require('sha1');

import {routesForApp, coalesceRoutesToTerminals, matcherForTerminal} from './routes';
import {loadNgModule, recursiveListDir} from './util';

function sha1(file: string): string {
  const raw = sha1_raw(fs.readFileSync(file), {asBytes: true}) as any as Array<number>;
  return Buffer.from(raw).toString('hex');
}

interface StaticManifest {
  [url: string]: string;
}

function genStaticManifest(dist: string, baseUrl: string = '/some/base/url'): Promise<StaticManifest> {
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substr(0, baseUrl.length - 1);
  }
  const manifest = recursiveListDir(dist)
    .reduce((manifest, entry) => {
      manifest[`${baseUrl}/${entry}`] = sha1(path.join(dist, entry));
      return manifest;
    }, {} as StaticManifest);
  return Promise.resolve(manifest);
}

interface RoutingManifest {
  index: string;
  routes: RoutingManifestRoutes;
}

interface RoutingManifestRoutes {
  [urlPattern: string]: {
    prefix?: boolean;
    match?: string;
  };
}

function genRoutingManifest(modulePath: string, index: string = '/index.html', baseUrl: string = '/some/base/url'): Promise<RoutingManifest> {
  const module = loadNgModule(path.join(process.cwd(), modulePath));
  return routesForApp(module)
    .then(routes => coalesceRoutesToTerminals(routes))
    .then(terminals => terminals.map(terminal => matcherForTerminal(terminal, baseUrl)))
    .then(matchers => matchers.reduce((routes, matcher) => {
      routes[matcher.pattern] = {match: matcher.match};
      return routes;
    }, {} as RoutingManifestRoutes))
    .then(routes => ({index, routes}));
}

interface NgswManifest {
  static: StaticManifest;
  routing?: RoutingManifest;
}

Promise
  .all([
    genStaticManifest(process.argv[2]),
    genRoutingManifest(process.argv[3])
  ])
  .then(([staticManifest, routingManifest]) => ({
    static: staticManifest,
    routing: routingManifest
  }))
  .then(manifest => console.log(JSON.stringify(manifest, null, 2)));
