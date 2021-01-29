(function(window) {
  window["env"] = window["env"] || {};

  window["env"]["commit"] = 'local-not-replaced'
  window["env"]["sandbox"] = 'https://carthage.tezedge.com:3030';
  window["env"]["api"] = [
    {
      id: 'master.dev.tezedge',
      name: 'master.dev.tezedge',
      http: 'http://master.dev.tezedge.com:18732',
      debugger: 'http://master.dev.tezedge.com:17732',
      ws: false
    }
  ];
})(this);
