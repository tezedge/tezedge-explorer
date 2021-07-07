(function (window) {
  window['env'] = window['env'] || {};

  const api = JSON.parse('${API}');
  const commitId = '${COMMIT}';
  const rust = api.find(node => !node.name.includes('ocaml') && !node.name.includes('octez'));
  if (rust && commitId) {
    rust.features.push({ name: 'commit', id: commitId });
  }

  window['env']['api'] = api || [];
  console.log('${COMMIT}');

})(this);
