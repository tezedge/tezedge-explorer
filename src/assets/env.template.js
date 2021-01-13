(function(window) {
  window['env'] = window['env'] || {};

  window['env']['sandbox'] = '${SANDBOX}';
  window['env']['api'] = JSON.parse('${API}') || [];
})(this);
