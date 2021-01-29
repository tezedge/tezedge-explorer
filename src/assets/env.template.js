(function(window) {
  window['env'] = window['env'] || {};

  window['env']['commit'] = '${COMMIT}'
  window['env']['sandbox'] = '${SANDBOX}';
  window['env']['api'] = JSON.parse('${API}') || [];
})(this);
