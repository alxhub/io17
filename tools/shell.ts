import 'reflect-metadata';
import 'zone.js/dist/zone-node.js';

import {enableProdMode, NgModule, NgModuleFactory, NgModuleFactoryLoader, ReflectiveInjector} from '@angular/core';
import {COMPILER_PROVIDERS, JitCompiler, ResourceLoader} from '@angular/compiler';
import {ServerModule, renderModuleFactory} from '@angular/platform-server';

import * as fs from 'fs';

const pathAndHash = '../src/app/module#AppModule';
const indexHtml = fs.readFileSync('./src/index.html').toString();

function loadAppModule(pathAndHash: string): any {
  const [modPath, exportName] = pathAndHash.split('#');
  return require(modPath)[exportName];
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

const moduleType = loadAppModule(pathAndHash);

const annotations: any = Reflect.getMetadata('annotations', moduleType)[0];
const bootstrap = annotations.bootstrap;

@NgModule({
  bootstrap,
  imports: [
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
