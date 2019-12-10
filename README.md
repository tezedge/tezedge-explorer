# TezosNodeExplorer 

## Instalaltion

`npm install`

## Config

`environments/environment.ts`

```
export const environment = {
  production: false,
  api: {
    ws: 'ws://127.0.0.1:4927/',
  } 
};
```

## Development server

Run `npm run start` for a dev server.
Navigate to `http://localhost:4200/`. 

## Crypto support
/Users/jurajselep/Projects/tezos-node-explorer/node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js

node: {
  crypto: true,
  stream: true
},
