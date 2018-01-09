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

      // **Caution:** when you're calling .append(), make sure to pass it the
      // jQuery object for the view and not just the HTML! Passing in the HTML
      // would create a new DOM node, different from the one the View has.
      // This isn't what we want - we wouldn't be able to listen to events on it!

      var renderPortfolioAndSearch = function () {
        //Complete this helper function

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

      // TODO: Complete the rest of the search method.

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
        //double check this!
        window.searchResultsCollection.set([]);
        //re-render models with helper fxn
        renderPortfolioAndSearch();
        //update showingSearchView to true
        showingSearchView = true;
        window.searchView.setSearchTerm('');
      }

      // Keep in mind that, if there is no query, then you need to set the
      // searchResultsCollection to be empty before rendering and set the search term to ''.
      // If there IS a query, you need to call client.searchStock and set the
      // searchResultsCollection to its results. Then, if the search view is already up,
      // it will auto-update to reflect the new query. Otherwise, you will need to render the
      // portfolio and search views and set the search term to the query.
      // Don't forget to update showingSearchView when you're done rendering/updating,
      // and don't forget to remove the stock view!

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

      // Remember that you'll need to do the following:
      // * Create a StockModel with the symbol passed in as an argument.
      // * Use client.listenForPriceUpdates on this newly created model.
      // * Assign window.stockView to be a new StockView backed by the new model,
      //   and append its $el to the div with id app-container.
      // * Use client.updateModels to update the stock price, set showingSearchView,
      //   and render the new view.


    }



  });
  window.TickerRouter = TickerRouter;
});
