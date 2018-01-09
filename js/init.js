$(function () {
  window.client = new ClientModel();

  window.portfolioCollection = new StockCollection();
  window.searchResultsCollection = new StockCollection();

  window.router = new TickerRouter();
  Backbone.history.start({pushState: false});
});
