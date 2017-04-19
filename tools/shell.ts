import 'reflect-metadata';
import 'zone.js/dist/zone-node.js';

import {enableProdMode, NgModule, NgModuleFactory, NgModuleFactoryLoader, ReflectiveInjector} from '@angular/core';
import {COMPILER_PROVIDERS, JitCompiler, ResourceLoader} from '@angular/compiler';
import {ServerModule, renderModuleFactory} from '@angular/platform-server';
import {jitCompiler, loadNgModule, relToAbs} from './util';

import * as fs from 'fs';

const fileModule = relToAbs(process.argv[2]);
const fileIndex = relToAbs(process.argv[3]);
const fileServerModule = process.argv.length > 4 ? relToAbs(process.argv[4]) : null;

const indexHtml = fs.readFileSync(fileIndex).toString();

class RequireNgModuleFactoryLoader implements NgModuleFactoryLoader {
  load(pathAndHash: string): Promise<NgModuleFactory<any>> {
    const [modPath, exportName] = pathAndHash.split('#');
    const relModPath = `../src/${modPath}`;
    const module = require(relModPath)[exportName];
    return jitCompiler().compileModuleAsync(module);
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
jitCompiler()
  .compileModuleAsync(AppShellModule)
  .then(factory => renderModuleFactory(factory, {url: '/', document: indexHtml}))
  .then(html => console.log(html));
