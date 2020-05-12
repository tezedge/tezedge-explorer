export const environment = {
  production: true,
  api: [
    {
      id: 'localhost',
      name: 'localhost',
      http: 'http://127.0.0.1:8732',
      ws: 'ws://127.0.0.1:4927',
    },
    {
      id: 'rust-carthage-tezedge',
      name: 'carthage.tezedge.com',
      http: 'https://carthage.tezedge.com:8732',
      ws: 'wss://carthage.tezedge.com',
    },
    {
      id: 'ocaml-carthage-tezedge',
      name: '116.202.246.107',
      http: 'http://116.202.246.107:18732',
      ws: false,
    }
  ]
};
