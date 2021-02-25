(function(window) {
  window["env"] = window["env"] || {};

  window["env"]["commit"] = '';
  window["env"]["sandbox"] = 'https://carthage.tezedge.com:3030';
  window["env"]["api"] = [
    {
      id: 'rust.carthage.tezedge.com',
      name: 'Tezedge',
      http: 'https://carthage.tezedge.com:8752',
      debugger: 'https://carthage.tezedge.com:8753',
      monitoring: 'https://carthage.tezedge.com:8754/resources/tezedge',
      ws: 'wss://carthage.tezedge.com:443'
    },
    {
      id: 'ocaml.carthage.tezedge.com',
      name: 'Ocaml',
      http: 'https://carthage.tezedge.com:8742',
      debugger: 'https://carthage.tezedge.com:8743',
      monitoring: 'https://carthage.tezedge.com:8754/resources/ocaml',
      ws: false
    }
  ];
})(this);
