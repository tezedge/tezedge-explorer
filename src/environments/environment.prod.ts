export const environment = {
  production: true,
  api: [
    // {
    //   id: 'localhost',
    //   name: 'localhost',
    //   http: 'http://127.0.0.1:8732',
    //   debugger: false,
    //   ws: 'ws://127.0.0.1:4927',
    // },
    // {
    //   id: 'rust-carthage-tezedge',
    //   name: 'rust.carthage.tezedge.com',
    //   http: 'https://carthage.tezedge.com:8732',
    //   debugger: 'https://carthage.tezedge.com:8733',
    //   ws: 'wss://carthage.tezedge.com',
    // },
    {
      id: 'rust-carthage-tezedge',
      name: 'rust.carthage.tezedge.com',
      http: 'https://carthage.tezedge.com:8752',
      debugger: 'https://carthage.tezedge.com:8753',
      ws: 'wss://carthage.tezedge.com',
    },
    {
      id: 'ocaml-carthage-tezedge',
      name: 'ocaml.carthage.tezedge.com',
      http: 'https://carthage.tezedge.com:8742',
      debugger: 'https://carthage.tezedge.com:8743',
      ws: false,
    },
    {
      id: 'sandbox-carthage-tezedge',
      name: 'sandbox.dev.tezedge.com',
      http: 'http://sandbox.dev.tezedge.com:18732',
      debugger: 'http://sandbox.dev.tezedge.com:8732',
      ws: 'ws://sandbox.dev.tezedge.com:4927',
    },
    // {
    //   id: 'ocaml-carthage-tezedge-debuger',
    //   name: 'debugger.ocaml.carthage.tezedge.com',
    //   http: 'http://116.202.246.107:18732',
    //   debugger: 'http://116.202.246.107:17732',
    //   ws: false,
    // },
    // {
    //   id: 'ocaml-mainnet-simplestaking-com',
    //   name: 'ocaml.mainnet.simplestaking.com',
    //   http: 'https://mainnet.simplestaking.com:3000',
    //   debugger: false,
    //   ws: false,
    // }
  ],
  sandbox: 'http://sandbox.dev.tezedge.com:3030', 
};
