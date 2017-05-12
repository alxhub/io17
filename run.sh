#!/bin/bash
PATH=$PATH:$(npm bin)
set -x

# Initial clean
rm -rf dist/*

# Production build
ng build --prod

# Copy the web app manifest to the hosting root.
cp src/manifest.json dist/

# Serve
cd dist
http-server