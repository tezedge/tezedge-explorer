(function (window) {
  window['env'] = window['env'] || {};

  window['env']['api'] = JSON.parse('${API}') || [];
})(this);
