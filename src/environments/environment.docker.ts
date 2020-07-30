export const environment = {
    production: true,
    api: [
      {
        id: 'rust-carthage-tezedge',
        name: 'rust-node',
        http: 'http://rust-node:8752',
        debugger: 'http://rust-debugger:8753',
        ws: 'ws://rust-debugge:4927',
      },
      {
        id: 'ocaml-carthage-tezedge',
        name: 'ocaml-node',
        http: 'http://ocaml-node:8742',
        debugger: 'http://ocaml-debugger:8743',
        ws: false,
      },
    ]
  };
  