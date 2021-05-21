export const environment = {
  production: false,
  api: [
    {
      id: 'rust.sandbox.dev.tezedge.com',
      name: 'rust.sandbox.dev.tezedge.com',
      http: 'http://sandbox.dev.tezedge.com:18732',
      debugger: 'https://sandbox.dev.tezedge.com:8753',
      monitoring: 'http://sandbox.dev.tezedge.com:38732/resources/tezedge',
      ws: 'ws://sandbox.dev.tezedge.com:4927',
      p2p_port: '9732',
      features: ['MONITORING', 'RESOURCES', 'MEMPOOL_ACTION', 'STORAGE_BLOCK', 'NETWORK_ACTION', 'LOGS_ACTION']
    },
    {
      id: 'ocaml',
      name: 'ocaml.develop.dev.tezedge.com',
      http: 'http://develop.dev.tezedge.com:18733',
      ws: false,
      monitoring: 'http://develop.dev.tezedge.com:38732/resources/ocaml',
      p2p_port: '9733',
      features: ['MONITORING', 'RESOURCES', 'MEMPOOL_ACTION', 'NETWORK_ACTION', 'LOGS_ACTION'],
    }
  ],
  memoryProfiler: 'http://debug.dev.tezedge.com:17832',
  debugger: 'http://sandbox.dev.tezedge.com:17732',
  sandbox: 'https://carthage.tezedge.com:3030',
  commit: ''
};
