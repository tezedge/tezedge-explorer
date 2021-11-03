export const environment = {
  production: false,
  api: [
    {
      id: 'prechecker.mempool.tezedge.com',
      name: 'tezedge',
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
        { name: 'state' }
      ]
    },
    // {
    //   id: 'tezedge',
    //   type: 'tezedge',
    //   name: 'tezedge.debug.dev.tezedge.com',
    //   http: 'http://debug.dev.tezedge.com:18732',
    //   p2p_port: 9732,
    //   features: [
    //     { name: 'ws', url: 'ws://debug.dev.tezedge.com:4927' },
    //     { name: 'debugger', url: 'http://debug.dev.tezedge.com:17732' },
    //     { name: 'monitoring' },
    //     { name: 'resources/system', monitoringUrl: 'http://debug.dev.tezedge.com:38732/resources/tezedge' },
    //     { name: 'resources/memory', memoryProfilerUrl: 'http://debug.dev.tezedge.com:17832' },
    //     { name: 'resources/storage' },
    //     { name: 'mempool' },
    //     { name: 'storage' },
    //     { name: 'network' },
    //     { name: 'logs' },
    //     { name: 'state' }
    //   ]
    // },
    // {
    //   id: 'tezedge',
    //   type: 'tezedge',
    //   name: 'tezedge.debug.dev.tezedge.com',
    //   http: 'http://debug.dev.tezedge.com:18732',
    //   p2p_port: '9732',
    //   features: [
    //     { name: 'ws', url: 'ws://debug.dev.tezedge.com:4927' },
    //     { name: 'debugger', url: 'http://debug.dev.tezedge.com:17732' },
    //     { name: 'monitoring' },
    //     { name: 'resources/system', monitoringUrl: 'http://debug.dev.tezedge.com:38732/resources/tezedge' },
    //     { name: 'resources/memory', memoryProfilerUrl: 'http://debug.dev.tezedge.com:17832' },
    //     { name: 'resources/storage' },
    //     { name: 'mempool' },
    //     { name: 'storage' },
    //     { name: 'network' },
    //     { name: 'logs' },
    //     { name: 'state' }
    //   ]
    // },
    {
      id: 'tezedge',
      type: 'tezedge',
      name: 'tezedge.develop.dev.tezedge.com',
      http: 'http://develop.dev.tezedge.com:18732',
      p2p_port: 9732,
      features: [
        { name: 'ws', url: 'ws://develop.dev.tezedge.com:4927' },
        { name: 'debugger', url: 'http://develop.dev.tezedge.com:17732' },
        { name: 'monitoring' },
        { name: 'resources/system', monitoringUrl: 'http://develop.dev.tezedge.com:38732/resources/tezedge' },
        { name: 'resources/memory', memoryProfilerUrl: 'http://develop.dev.tezedge.com:17832' },
        { name: 'resources/storage' },
        { name: 'mempool' },
        { name: 'storage' },
        { name: 'network' },
        { name: 'logs' },
        { name: 'state' },
        { name: 'smart-contracts' }
      ]
    }
  ]

};
