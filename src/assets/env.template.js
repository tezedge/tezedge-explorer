(function (window) {
  window['env'] = window['env'] || {};

  window['env']['api'] = JSON.parse('${API}') || [];

  // const rust = window['env']['api'].find(node => !node.name.includes('ocaml'));
  // const commitId = JSON.parse('${COMMIT}');
  // if (rust && commitId) {
  //   rust.features.push({ name: 'commit', id: commitId });
  // }
  //
  // console.log(rust);
  // console.log(commitId);

})(this);
