#!/bin/bash


PATH=$PATH:$(npm bin)
set -x

rm -rf dist/*
ng build --prod
  
mv dist/index.html dist/base.html
ngu-app-shell --module src/app/app.module.ts \
              --pre-module src/app/app.server.ts \
              --lazy-root src \
              --index dist/base.html 2>/dev/null > dist/index.html
rm dist/base.html

cp src/manifest.json dist/
ngu-sw-manifest --module src/app/app.module.ts \
                --lazy-root src \
                --in ./ngsw-manifest.json \
                --dist dist/ > tmp-ngsw-manifest.json
mv tmp-ngsw-manifest.json dist/ngsw-manifest.json

cp ~/mobile-toolkit/service-worker/worker/dist/bundles/worker-basic.js dist/
