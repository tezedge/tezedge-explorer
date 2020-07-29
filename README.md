# TezEdge | Explorer


## Pre-requisites

* nodejs v13

## Installation

`npm install`

## Config

`environments/environment.ts`

```
export const environment = {
  production: false,
  api: {
    ws: 'ws://127.0.0.1:4927/',
    http: 'http://127.0.0.1:18732',
  }
};
```

## Development server

Run `npm run start` for a dev server.
Navigate to `http://localhost:4200/`.

## Development with docker-compose
If you don't have nodejs environment setup, you can use docker-compose to run the current version
of the app:

```
git clone https://github.com/simplestaking/tezedge-explorer.git
cd tezedge-explorer
docker-compose -f docker/docker-compose-dev.yml up
```

The app will be available under http://localhost:4200/ and any changes to source files will
be reflected immediatelly.

## Mock server
Run `npm run server:json` for a json dev server.
Navigate to `http://localhost:3000/`.

Please view/edit `db.json` file according to your needs.

