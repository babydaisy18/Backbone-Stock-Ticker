$(function () {
  var SearchView = Backbone.View.extend({
    className: 'search-container',
    initialize: function () {
      // Define the templates that we'll use to render the search bar and results
      this.searchBarTemplate = Handlebars.compile($('#search-bar-template').html());
      this.searchResultsTemplate = Handlebars.compile($('#search-results-template').html());

      this.listenTo(this.collection, 'add', this.onChange);
      this.listenTo(this.collection, 'remove', this.onChange);
      this.listenTo(this.collection, 'change', this.onChange);
    },

    events: {
      // TODO: Define events
      'click .add-stock' : 'addStock',
      'keyup .search' : 'search'
    },

    onChange: function () {
      //Set what happens when changes are made.
      this.renderResults();
    },

    render: function () {
      //Render the search bar and the results.
      //takes no arguments so can be called w/out the .toJSON
      var html = this.searchBarTemplate();
      this.$el.html(html);
      this.renderResults();
    },

    renderResults: function () {
      this.$el.find('.search-results').remove();
      var collectionConverted = this.collection.toJSON();
      var html = this.searchResultsTemplate({results: collectionConverted});
      this.$el.append(html);
      // HINT: You'll probably call this from render too.
    },

    // Debounce delays a function from actually running until it hasn't been called for X milliseconds.
    // This is super handy for functions like search that are called on keypress, since you wait until
    // the user has typed in their actual query before hitting the server.
    search: _.debounce(function () {
      //Search for a stock given the input, and use the router to navigate to the correct URL.
      //FIX THIS
      var value = this.$('.search').val();
      window.router.navigate('q/' + value, {trigger: true});
      // You should use the router to do the actual searching; see routers/TickerRouter.js.
      // HINT: Don't forget to set {trigger: true} when you call navigate!
    }, 200),

    // Set the search term manually and focus the search input.
    setSearchTerm: function (term) {
      this.$el.find('.search').val(term).focus();
    },

    addStock: function (e) {
      // TODO: Add a stock to our portfolio collection.
      //Delete a stock from our collection
      var stocksymbol = $(e.target).attr('symbol');
      var stockprice = Number($(e.target).attr('price'));
      var addedmodel = new StockModel({ symbol: stocksymbol, price: stockprice });
      var modelArray = window.portfolioCollection.where({symbol: stocksymbol});
      if (!modelArray.length) {
        window.portfolioCollection.add(addedmodel);
      }
    }

  });

  window.SearchView = SearchView;
});
