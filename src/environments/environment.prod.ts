export const environment = {
  production: true,
  api: {
    default: {
      ws: 'wss://carthage.tezedge.com',
      http: 'https://carthage.tezedge.com:8732',
    }, 
    list:[
        {
          ws: 'ws://127.0.0.1:4927/',
          http: 'http://127.0.0.1:8732',
        },
        {
          ws: 'wss://carthage.tezedge.com',
          http: 'https://carthage.tezedge.com:8732',
        },
        {
          ws: 'wss://',
          http: 'http://116.202.246.107:18732',
        },
      ],
    }
};
