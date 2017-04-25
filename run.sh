#!/bin/bash

PATH=$PATH:$(npm bin)
set -x

# Production build
rm -rf dist/*
ng build --prod
cp src/manifest.json dist/

# Serve
cd dist
http-server