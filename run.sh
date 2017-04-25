#!/bin/bash

PATH=$PATH:$(npm bin)
set -x

# Production build
ng build --prod

# Post-build logic goes here



# Serve
cd dist
http-server