import 'reflect-metadata';
import 'zone.js/dist/zone-node.js';

import {ReflectiveInjector, enableProdMode} from '@angular/core';
import {COMPILER_PROVIDERS, JitCompiler, ResourceLoader} from '@angular/compiler';

import * as fs from 'fs';
import * as path from 'path';

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

class FileLoader implements ResourceLoader {
  get(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(fs.readFileSync(url).toString());
    });
  }
}

export function loadNgModule(modPath: string, moduleName?: string): any {
  const exported = require(modPath);
  if (moduleName) {
    return exported[moduleName];
  }

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

export function relToAbs(file: string): string {
  if (path.isAbsolute(file)) {
    return file;
  }
  return path.normalize(path.join(process.cwd(), file));
}

let _jitCompiler: JitCompiler|null = null;

export function jitCompiler(): JitCompiler {
  if (_jitCompiler === null) {
    enableProdMode();
    const injector = ReflectiveInjector.resolveAndCreate([
      COMPILER_PROVIDERS,
      {provide: ResourceLoader, useValue: new FileLoader()}
    ]);

    _jitCompiler = injector.get(JitCompiler);
  }
  return _jitCompiler;
}