$(function () {
  var SearchView = Backbone.View.extend({
    className: 'search-container',
    initialize: function () {
      // Define templates to render the search bar and results
      this.searchBarTemplate = Handlebars.compile($('#search-bar-template').html());
      this.searchResultsTemplate = Handlebars.compile($('#search-results-template').html());

      this.listenTo(this.collection, 'add', this.onChange);
      this.listenTo(this.collection, 'remove', this.onChange);
      this.listenTo(this.collection, 'change', this.onChange);
    },

    events: {
      'click .add-stock' : 'addStock',
      'keyup .search' : 'search'
    },

    onChange: function () {
      //if changes are made
      this.renderResults();
    },

    render: function () {
      //Render the search bar and the results
      var html = this.searchBarTemplate();
      this.$el.html(html);
      this.renderResults();
    },

    renderResults: function () {
      this.$el.find('.search-results').remove();
      var collectionConverted = this.collection.toJSON();
      var html = this.searchResultsTemplate({results: collectionConverted});
      this.$el.append(html);
    },


    search: _.debounce(function () {
      //Search for a stock given the input, and use the router to navigate to the correct URL
      var value = this.$('.search').val();
      window.router.navigate('q/' + value, {trigger: true});
    }, 200),

    // Set the search term manually and focus the search input
    setSearchTerm: function (term) {
      this.$el.find('.search').val(term).focus();
    },

    addStock: function (e) {
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
