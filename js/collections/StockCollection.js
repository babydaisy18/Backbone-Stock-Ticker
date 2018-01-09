$(function () {
  var StockCollection = Backbone.Collection.extend({
    // TODO: Set the model for this Collection.
    model: window.StockModel
  });
  window.StockCollection = StockCollection;
});
