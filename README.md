# Angular Progressive Web App Example, IO 2017

This is the Hero Store, an example application for Google IO. It's a simple app, with no actual functionality and two routes, but is useful for demonstrating techniques for service worker caching, application shells, and push notifications.

## Setup

    # Install dependencies
    $ yarn
    # (or npm install)
    
    # Run the server
    $ ./run.sh

## The ng-pwa-tools

This app depends on `ng-pwa-tools`, which automate some of the more configuration-heavy tasks of progressive enhancement, including:

* service worker manifest generation (`ngu-sw-manifest`)
* application shell rendering (`ngu-app-shell`)
* HTTP/2 push configuration (`ngu-firebase-push`)

In Windows, you must run the above commands in Bash prefixed by `./node_modules/.bin/`, e.g. `./node_modules/.bin/ngu-sw-manifest`

## Branches

* `master`: plain application before progressive enhancement
* `pwa`: version with service worker, app shell, HTTP/2 server push, and push notifications enabled

### See the talk for more details


