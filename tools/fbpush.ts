import * as fs from 'fs';
import * as path from 'path';

import {coalesceRoutesToTerminals, routesForApp, TerminalRoute} from './routes';
import {loadNgModule, recursiveListDir} from './util';
import {ChunkMap, chunkMapForDist} from './spelunk';

import * as p5 from 'parse5';

interface FbJson {
  [key: string]: any;
  hosting?: FbJsonHosting;
}

interface FbJsonHosting {
  [key: string]: any;
  headers?: FbJsonHostingHeadersMatch[];
}

interface FbJsonHostingHeadersMatch {
  source: string;
  headers: FbJsonHostingHeader[];
}

interface FbJsonHostingHeader {
  key: string;
  value: string;
}

interface FbLinkHeader {
  url: string;
  rel: string;
  as: string;
  nopush?: boolean;
}

function isRouteFbCompatible(): boolean {
  return false;
}

interface FbTerminal {
  url: string;
  chunks: string[];
}

enum FbTerminalEvalState {
  PREFIX,
  SUFFIX,
}

function toFbCompatibleTerminal({path, loadChildren, prefix}: TerminalRoute, chunkMap: ChunkMap): FbTerminal|null {
  let state = FbTerminalEvalState.PREFIX;
  let url = path
    .split('/')
    .reduce((url, segment) => {
      if (url === null) {
        return null;
      }
      if (segment === '**' || segment.startsWith(':')) {
        if (state === FbTerminalEvalState.PREFIX) {
          url += url.endsWith('/') ? '*' : '/*';
        }
        state = FbTerminalEvalState.SUFFIX;
      } else {
        if (state === FbTerminalEvalState.SUFFIX) {
          return null;
        }
        url += '/' + segment;
      }
      return url;
    }, '');
  if (url === null) {
    return null;
  }
  if (state === FbTerminalEvalState.PREFIX && prefix) {
    url += url.endsWith('/') ? '*' : '/*';
  }
  const chunks = resolveLazyChunks(chunkMap, loadChildren);
  return {url, chunks};
}

function resolveLazyChunks(chunkMap: ChunkMap, loadChildren: string[]): string[] {
  return loadChildren
    .map(child => {
      const [modulePath] = child.split('#');
      const factoryPath = `${modulePath}.ngfactory`;
      if (!chunkMap[factoryPath]) {
        throw new Error(`No chunk found for module reference ${child}`);
      }
      return chunkMap[factoryPath];
    });
}

function getHeaderForLink(link: FbLinkHeader): string {
  return `<${link.url}>;rel=${link.rel};as=${link.as}${!!link.nopush ? ';nopush' : ''}`;
}

function terminalToFbLinks(terminal: FbTerminal, staticLinks: FbLinkHeader[], baseUrl: string): FbJsonHostingHeadersMatch {
  if (baseUrl.startsWith('/')) {
    baseUrl = baseUrl.substr(0, baseUrl.length - 1);
  }
  const source = terminal.url;
  const value = staticLinks
    .concat(terminal.chunks.map(chunk => getLinkForFile(chunk, baseUrl)))
    .map(link => getHeaderForLink(link))
    .join(',');
  return {
    source,
    headers: [
      {key: 'Link', value},
    ],
  };
}

function getLinkForFile(file: string, baseUrl: string): FbLinkHeader {
  return {
    url: `${baseUrl}/${file}`,
    as: file.endsWith('.css') ? 'style' : 'script',
    rel: 'preload',
  };
}

function getStaticLinks(dist: string, baseUrl: string = '/'): FbLinkHeader[] {
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substr(0, baseUrl.length - 1);
  }
  return recursiveListDir(dist)
    .filter(file => file.endsWith('.bundle.js') || file.endsWith('.css'))
    .map(file => getLinkForFile(file, baseUrl));
}

const dist = path.join(process.cwd(), process.argv[3]);
const index = fs.readFileSync(path.join(dist, 'index.html')).toString();
const module = loadNgModule(path.join(process.cwd(), process.argv[2]));
const chunkMap = chunkMapForDist(dist);
if (chunkMap === null) {
  throw new Error(`No chunk mapping found for dist dir!`);
}

routesForApp(module)
  .then(routes => coalesceRoutesToTerminals(routes)
    .map(terminal => toFbCompatibleTerminal(terminal, chunkMap))
    .filter(terminal => terminal !== null)
    .map(terminal => terminalToFbLinks(terminal, getStaticLinks(dist, '/'), '/'))
  )
  .then(terminals => console.log(JSON.stringify(terminals, null, 2)));