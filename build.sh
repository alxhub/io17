#!/bin/bash

ng build --prod
mv dist/index.html dist/index-no-shell.html

node_modules/.bin/ts-node ./tools/shell.ts ./src/app/module ./dist/index-no-shell.html ./src/app/server/module.ts > ./dist/index.html