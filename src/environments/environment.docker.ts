export const environment = {
  production: true,
  api: [
    {
      id: 'sandbox-carthage-tezedge',
      name: 'rust.carthage.node',
      http: 'http://127.0.0.1:18732',
      debugger: false,
      ws: 'ws://127.0.0.1:4927',
    },
    {
      id: 'sandbox-carthage-tezedge',
      name: 'rust.sandbox.node',
      http: 'http://127.0.0.1:18732',
      debugger: 'http://127.0.0.1:17732',
      ws: 'ws://127.0.0.1:4927',
    },
  ],
  sandbox: 'http://127.0.0.1:3030',
};
