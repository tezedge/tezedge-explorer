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


## Mock server
Run `npm run server:json` for a json dev server.
Navigate to `http://localhost:3000/`.

Please view/edit `db.json` file according to your needs.

