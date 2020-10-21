export const environment = {
  production: false,
  api: [
    // {
    //   id: 'rust-carthage-tezedge',
    //   name: 'rust.carthage.tezedge.com',
    //   http: 'https://carthage.tezedge.com:8752',
    //   debugger: 'https://carthage.tezedge.com:8753',
    //   ws: 'wss://carthage.tezedge.com',
    // },
    // {
    //   id: 'ocaml-carthage-tezedge',
    //   name: 'ocaml.carthage.tezedge.com',
    //   http: 'https://carthage.tezedge.com:8742',
    //   debugger: 'https://carthage.tezedge.com:8743',
    //   ws: false,
    // },
    {
      id: 'sandbox-carthage-tezedge',
      name: 'rust.localhost.node',
      http: 'http://127.0.0.1:18732',
      debugger: 'http://127.0.0.1:17732',
      ws: 'ws://127.0.0.1:4927',
    },
  ],
  sandbox: 'http://127.0.0.1:3030', 
};
