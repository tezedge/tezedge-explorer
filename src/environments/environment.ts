export const environment = {
  production: false,
  api: [
    // DEVELOP:
    {
      id: 'rust',
      name: 'rust.develop.dev.tezedge.com',
      http: 'http://develop.dev.tezedge.com:18732',
      // http: 'http://116.202.128.230:18732',
      debugger: 'http://develop.dev.tezedge.com:17732',
      ws: 'ws://develop.dev.tezedge.com:4927',
      monitoring: 'http://develop.dev.tezedge.com:38732/resources/tezedge',
      features: ['MONITORING', 'RESOURCES', 'MEMPOOL_ACTION', 'STORAGE_BLOCK', 'NETWORK_ACTION', 'LOGS_ACTION'],
    },
    {
      id: 'ocaml',
      name: 'ocaml.develop.dev.tezedge.com',
      http: 'http://develop.dev.tezedge.com:18733',
      debugger: 'http://develop.dev.tezedge.com:17733',
      ws: false,
      monitoring: 'http://develop.dev.tezedge.com:38732/resources/ocaml',
      features: ['MONITORING', 'RESOURCES', 'MEMPOOL_ACTION', 'NETWORK_ACTION', 'LOGS_ACTION'],
    }

    // PROD:
    // {
    //   id: 'rust.carthage.tezedge.com',
    //   name: 'rust.carthage.tezedge.com',
    //   http: 'https://carthage.tezedge.com:8752',
    //   debugger: 'https://carthage.tezedge.com:8753',
    //   monitoring: 'https://carthage.tezedge.com:8754/resources/tezedge',
    //   ws: 'wss://carthage.tezedge.com:443'
    // },
    // {
    //   id: 'ocaml.carthage.tezedge.com',
    //   name: 'ocaml.carthage.tezedge.com',
    //   http: 'https://carthage.tezedge.com:8742',
    //   debugger: 'https://carthage.tezedge.com:8743',
    //   monitoring: 'https://carthage.tezedge.com:8754/resources/ocaml',
    //   ws: false
    // }
  ],
  sandbox: 'https://carthage.tezedge.com:3030',
  commit: ''
};
