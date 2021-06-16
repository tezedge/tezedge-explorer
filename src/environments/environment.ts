export const environment = {
  production: false,
  api: [
    {
      id: 'rust.develop.dev.tezedge.com',
      name: 'rust.develop.dev.tezedge.com',
      http: 'http://develop.dev.tezedge.com:18732',
      debugger: 'https://develop.dev.tezedge.com:8753',
      monitoring: 'http://develop.dev.tezedge.com:38732/resources/tezedge',
      ws: 'ws://develop.dev.tezedge.com:4927',
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
  memoryProfiler: 'http://develop.dev.tezedge.com:17832',
  debugger: 'http://develop.dev.tezedge.com:17732',
  sandbox: 'http://localhost:3030',
  commit: ''
};
