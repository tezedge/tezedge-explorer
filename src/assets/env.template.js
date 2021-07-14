(function (window) {
  window['env'] = window['env'] || {};

  const api = JSON.parse('${API}');
  const commitId = '${COMMIT}';
  const rust = api.find(node => node.type === 'tezedge');
  if (rust && commitId) {
    rust.features.push({ name: 'commit', id: commitId });
  }

  window['env']['api'] = api || [];

})(this);
