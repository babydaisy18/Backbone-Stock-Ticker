$(function () {
  var StockCollection = Backbone.Collection.extend({
    model: window.StockModel
  });
  window.StockCollection = StockCollection;
});
