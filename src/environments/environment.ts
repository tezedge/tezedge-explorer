const DEVELOP = {
  id: 'tezedge',
  type: 'tezedge',
  name: 'develop.dev.tezedge.com',
  http: 'http://develop.dev.tezedge.com:18732',
  p2p_port: 9732,
  features: [
    { name: 'ws', url: 'ws://develop.dev.tezedge.com:4927' },
    { name: 'debugger', url: 'http://develop.dev.tezedge.com:17732' },
    { name: 'monitoring' },
    { name: 'resources/system', monitoringUrl: 'http://develop.dev.tezedge.com:38732/resources/tezedge' },
    { name: 'resources/memory', memoryProfilerUrl: 'http://develop.dev.tezedge.com:17832' },
    { name: 'resources/storage' },
    { name: 'resources/state' },
    { name: 'mempool' },
    { name: 'storage' },
    { name: 'network' },
    { name: 'logs' },
    { name: 'state' },
    { name: 'contracts' }
  ]
};
const MASTER = {
  id: 'tezedge.master.dev.tezedge.com',
  name: 'tezedge.master.dev.tezedge.com',
  http: 'https://master.dev.tezedge.com:8752',
  p2p_port: '9732',
  type: 'tezedge',
  features: [
    { name: 'ws', url: 'wss://master.dev.tezedge.com:443' },
    { name: 'debugger', url: 'https://master.dev.tezedge.com:8753' },
    { name: 'sandbox', url: 'http://localhost:3030' },
    { name: 'commit', id: '' },
    { name: 'monitoring' },
    { name: 'resources/system', monitoringUrl: 'https://master.dev.tezedge.com:8754/resources/tezedge' },
    { name: 'resources/memory', memoryProfilerUrl: 'https://master.dev.tezedge.com:8764' },
    { name: 'resources/storage' },
    { name: 'mempool' },
    { name: 'storage' },
    { name: 'network' },
    { name: 'logs' },
    { name: 'state' },
    { name: 'open-api' },
    { name: 'contracts' },
  ]
};
const PRECHECKER = {
  id: 'prechecker.mempool.tezedge.com',
  type: 'tezedge',
  name: 'prechecker.tezedge',
  http: 'http://prechecker.mempool.tezedge.com:18732',
  p2p_port: 9732,
  features: [
    { name: 'ws', url: 'ws://prechecker.mempool.tezedge.com:4927' },
    { name: 'debugger', url: 'http://prechecker.mempool.tezedge.com:17732' },
    { name: 'monitoring' },
    { name: 'resources/storage' },
    { name: 'resources/system', monitoringUrl: 'http://prechecker.mempool.tezedge.com:4444/resources/tezedge' },
    { name: 'mempool' },
    { name: 'storage' },
    { name: 'network' },
    { name: 'logs' },
    { name: 'open-api' },
    // { name: 'state' },
    { name: 'contracts' },
  ]
};
const DEBUG = {
  id: 'tezedge',
  type: 'tezedge',
  name: 'tezedge.debug.dev.tezedge.com',
  http: 'http://debug.dev.tezedge.com:18732',
  p2p_port: 9732,
  features: [
    { name: 'ws', url: 'ws://debug.dev.tezedge.com:4927' },
    { name: 'debugger', url: 'http://debug.dev.tezedge.com:17732' },
    { name: 'monitoring' },
    { name: 'resources/system', monitoringUrl: 'http://debug.dev.tezedge.com:38732/resources/tezedge' },
    { name: 'resources/memory', memoryProfilerUrl: 'http://debug.dev.tezedge.com:17832' },
    { name: 'resources/storage' },
    { name: 'resources/state' },
    { name: 'mempool' },
    { name: 'storage' },
    { name: 'network' },
    { name: 'logs' },
    { name: 'state' }
  ]
};
const PROD = {
  id: 'tezedge',
  type: 'tezedge',
  name: 'prod.tezedge.com',
  http: 'http://prod.tezedge.com:18732',
  p2p_port: 9732,
  features: [
    { name: 'ws', url: 'ws://prod.tezedge.com:4927' },
    { name: 'debugger', url: 'http://prod.tezedge.com:17732' },
    { name: 'monitoring' },
    { name: 'resources/system', monitoringUrl: 'http://prod.tezedge.com:38732/resources/tezedge' },
    { name: 'resources/memory', memoryProfilerUrl: 'http://prod.tezedge.com:17832' },
    { name: 'resources/storage' },
    { name: 'mempool' },
    { name: 'storage' },
    { name: 'network' },
    { name: 'logs' },
    { name: 'state' },
    { name: 'contracts' }
  ]
};
const TRACE = {
  id: 'tezedge',
  type: 'tezedge',
  name: 'trace.dev.tezedge.com',
  http: 'http://trace.dev.tezedge.com:18732',
  p2p_port: 9732,
  features: [
    { name: 'ws', url: 'ws://trace.dev.tezedge.com:18732' },
    { name: 'debugger', url: 'http://trace.dev.tezedge.com:17732' },
    { name: 'monitoring' },
    { name: 'resources/system', monitoringUrl: 'http://trace.dev.tezedge.com:38732/resources/tezedge' },
    { name: 'resources/memory', memoryProfilerUrl: 'http://trace.dev.tezedge.com:17832' },
    { name: 'resources/storage' },
    { name: 'mempool' },
    { name: 'storage' },
    { name: 'network' },
    { name: 'logs' },
    { name: 'state' },
    { name: 'contracts' },
  ]
};
const OCTEZ_DEVELOP = {
  id: 'octez',
  name: 'octez.develop.dev.tezedge.com',
  http: 'http://develop.dev.tezedge.com:18733',
  p2p_port: '9733',
  type: 'octez',
  features: [
    { name: 'debugger', url: 'http://develop.dev.tezedge.com:17732' },
    { name: 'sandbox', url: 'http://localhost:3030' },
    { name: 'monitoring' },
    { name: 'resources/system', monitoringUrl: 'http://develop.dev.tezedge.com:38732/resources/ocaml' },
    { name: 'resources/memory', memoryProfilerUrl: 'http://develop.dev.tezedge.com:17832' },
    { name: 'mempool' },
    { name: 'network' },
    { name: 'logs' },
  ]
};
const OCTEZ_MASTER = {
  id: 'octez.master.dev.tezedge.com',
  name: 'octez.master.dev.tezedge.com',
  http: 'https://master.dev.tezedge.com:8742',
  p2p_port: '9733',
  type: 'octez',
  features: [
    { name: 'debugger', url: 'https://master.dev.tezedge.com:8753' },
    { name: 'sandbox', url: 'http://localhost:3030' },
    { name: 'monitoring' },
    { name: 'resources/system', monitoringUrl: 'https://master.dev.tezedge.com:8754/resources/ocaml' },
    { name: 'resources/memory', memoryProfilerUrl: 'https://master.dev.tezedge.com:8764' },
    { name: 'mempool' },
    { name: 'network' },
    { name: 'logs' },
  ]
};
const OCTEZ_STORAGE = {
  id: 'octez',
  type: 'octez',
  name: 'octez.storage.dev.tezedge.com',
  http: 'http://storage.dev.tezedge.com:18733',
  p2p_port: 9733,
  features: [
    { name: 'debugger', url: 'http://storage.dev.tezedge.com:17732' },
    { name: 'monitoring' },
    { name: 'resources/system', monitoringUrl: 'http://storage.dev.tezedge.com:38732/resources/ocaml' },
    { name: 'resources/memory', memoryProfilerUrl: 'http://storage.dev.tezedge.com:17832' },
    { name: 'resources/storage' },
    { name: 'mempool' },
    { name: 'network' },
    { name: 'logs' }
  ]
};
const STORAGE = {
  id: 'tezedge',
  type: 'tezedge',
  name: 'tezedge.storage.dev.tezedge.com',
  http: 'http://storage.dev.tezedge.com:18732',
  p2p_port: 9732,
  features: [
    { name: 'ws', url: 'ws://storage.dev.tezedge.com:4927' },
    { name: 'debugger', url: 'http://storage.dev.tezedge.com:17732' },
    { name: 'monitoring' },
    { name: 'resources/system', monitoringUrl: 'http://storage.dev.tezedge.com:38732/resources/tezedge' },
    { name: 'resources/memory', memoryProfilerUrl: 'http://storage.dev.tezedge.com:17832' },
    { name: 'resources/storage' },
    { name: 'mempool' },
    { name: 'storage' },
    { name: 'network' },
    { name: 'logs' },
    { name: 'state' }
  ]
};
const MEMPOOL = {
  id: 'tezedge',
  type: 'tezedge',
  name: 'tezedge.mempool.tezedge.com',
  http: 'http://mempool.tezedge.com:18732',
  p2p_port: 9732,
  features: [
    { name: 'ws', url: 'ws://mempool.tezedge.com:4927' },
    { name: 'debugger', url: 'http://mempool.tezedge.com:17732' },
    { name: 'monitoring' },
    { name: 'resources/system', monitoringUrl: 'http://mempool.tezedge.com:38732/resources/tezedge' },
    { name: 'resources/memory', memoryProfilerUrl: 'http://mempool.tezedge.com:17832' },
    { name: 'resources/storage' },
    { name: 'mempool' },
    { name: 'storage' },
    { name: 'network' },
    { name: 'logs' },
    { name: 'state' },
    { name: 'contracts' }
  ]
};
const MEMPOOL2 = {
  id: 'tezedge',
  type: 'tezedge',
  name: 'tezedge.mempool.tezedge.com',
  http: 'http://mempool.tezedge.com:38732',
  p2p_port: 29732,
  features: [
    { name: 'ws', url: 'ws://mempool.tezedge.com:34927' },
    { name: 'debugger', url: 'http://mempool.tezedge.com:27732' },
    { name: 'monitoring' },
    { name: 'resources/system', monitoringUrl: 'http://mempool.tezedge.com:38739/resources/tezedge' },
    { name: 'resources/storage' },
    { name: 'mempool' },
    { name: 'storage' },
    { name: 'network' },
    { name: 'logs' },
    { name: 'state' }
  ]
};

export const environment = {
  production: false,
  api: [
    // DEVELOP,
    // MASTER,
    // MEMPOOL,
    MEMPOOL2,
    // TRACE,
    // PRECHECKER,
    // DEBUG,
    // PROD,
    // STORAGE,
    // OCTEZ_DEVELOP,
    // OCTEZ_MASTER,
    // OCTEZ_STORAGE
  ]
};
