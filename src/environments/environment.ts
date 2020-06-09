// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: [
    // {
    //   id: 'localhost',
    //   name: 'localhost',
    //   http: 'http://127.0.0.1:8732',
    //   debugger: false,
    //   ws: 'ws://127.0.0.1:4927',
    // },
    {
      id: 'rust-carthage-tezedge',
      name: 'rust.carthage.tezedge.com',
      http: 'https://carthage.tezedge.com:8732',
      debugger: 'https://carthage.tezedge.com:8733',
      ws: 'wss://carthage.tezedge.com',
    },
    {
      id: 'ocaml-carthage-tezedge',
      name: 'ocaml.carthage.tezedge.com',
      http: 'https://carthage.tezedge.com:8742',
      debugger: 'https://carthage.tezedge.com:8743',
      ws: false,
    },
    // {
    //   id: 'ocaml-carthage-tezedge-debuger',
    //   name: 'debugger.ocaml.carthage.tezedge.com',
    //   http: 'http://116.202.246.107:18732',
    //   debugger: 'http://116.202.246.107:17732',
    //   ws: false,
    // },
    {
      id: 'ocaml-mainnet-simplestaking-com',
      name: 'ocaml.mainnet.simplestaking.com',
      http: 'https://mainnet.simplestaking.com:3000',
      debugger: false,
      ws: false,
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
