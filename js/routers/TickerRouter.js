$(function () {

  var removeExistingViews = function () {
    if (window.searchView) {
      window.searchView.remove();
    }

    if (window.stockView) {
      window.stockView.remove();
    }

    if (window.portfolioView) {
      window.portfolioView.remove();
    }
  };

  var removeStockView = function () {
    if (window.stockView) {
      window.stockView.remove();
    }
  };

  var showingSearchView = false;

  var TickerRouter = Backbone.Router.extend({
    routes: {
      //Set up routes
      'q/(:query)' : 'search',
      '' : 'search',
      '*symbol': 'singleStock'
    },

    search: function (query) {
      client.clearListening();
      client.listenForPriceUpdates(window.portfolioCollection);
      client.listenForPriceUpdates(window.searchResultsCollection);

      // Creates the portfolio and search views, renders them,
      // and appends their elements to the #app-container element.
      // It also calls client.updateModels() so prices are up-to-date.

      var renderPortfolioAndSearch = function () {

        //create window.portfolioView; window.searchView
        window.portfolioView = new PortfolioView({ collection: window.portfolioCollection });
        window.searchView = new SearchView({ collection: window.searchResultsCollection });
      
        //append to div w id app-container (searchView before portfolioView)
        $('#app-container').append(window.searchView.$el);
        $('#app-container').append(window.portfolioView.$el);


        // render
        window.searchView.render();
        window.portfolioView.render();
        //call client.updateModels to ensure the stock prices are up to date
        client.updateModels();
      };

      // IF QUERY EXISTS
      if (query !== null && query !== '') {
        client.searchStock(query, function (results) {
          window.searchResultsCollection.set(results);
          removeStockView();
          if (!showingSearchView) {
              //render (w helper fxn)
            renderPortfolioAndSearch();
            showingSearchView = true;
          }
          window.searchView.setSearchTerm(query);
        });
      } else {
        //remove all existing views
        removeExistingViews();
        //make sure there are no models in window.searchResultsCollection
        window.searchResultsCollection.set([]);
        //re-render models with helper fxn
        renderPortfolioAndSearch();
        //update showingSearchView to true
        showingSearchView = true;
        window.searchView.setSearchTerm('');
      }

    },

    singleStock: function (symbol) {
      removeExistingViews();
      client.clearListening();

      //create StockModel
      var newModel = new StockModel({symbol: symbol});

      //listen to price updates
      client.listenForPriceUpdates(newModel);
      client.updateModels();

      //assign window.stockView
      window.stockView = new SingleStockView({model: newModel});

      //append $el to div with id app-container
      $('#app-container').append(window.stockView.$el);

      //update the stock price, set showingSearchView, render the new view
      showingSearchView = false;
      window.stockView.render();

    }



  });
  window.TickerRouter = TickerRouter;
});
