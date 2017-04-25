#!/bin/bash

PATH=$PATH:$(npm bin)
set -x

# Production build
rm -rf dist/*
ng build --prod

mv dist/index.html pre-shell.html
ngu-app-shell --module src/app/app.module.ts \
              --lazy-root src \
              --index pre-shell.html \
              --pre-module src/app/app.server.ts > dist/index.html

# Post-build logic goes here
ngu-sw-manifest --module src/app/app.module.ts \
                --lazy-root src \
                --dist dist/ \
                --in src/ngsw-manifest.json > dist/ngsw-manifest.json

cp node_modules/@angular/service-worker/bundles/worker-basic.js dist/

ngu-firebase-push --module src/app/app.module.ts \
                  --lazy-root src \
                  --index dist/index.html \
                  --dist dist/ \
                  --in firebase-in.json > firebase.json

# Serve
cd dist
http-server