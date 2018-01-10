$(function () {
  var PortfolioView = Backbone.View.extend({
    className: 'portfolio-container',
    template: Handlebars.compile($('#portfolio-template').html()),
    initialize: function () {
      //Set up event listeners.
      this.listenTo(this.collection, 'add', this.onChange);
      this.listenTo(this.collection, 'remove', this.onChange);
      this.listenTo(this.collection, 'change', this.onChange);
    },

    events: {
      //Define events
      'click .delete-stock' : 'deleteStock'

    },

    onChange: function () {
      //Set what happens when changes are made
      this.render();
    },

    render: function () {
      //Render the portfolio that houses all of the added stocks
      var collectionConverted = this.collection.toJSON();
      var current = this.template({stocks: collectionConverted});
      this.$el.html(current);
    },

    deleteStock: function (e) {
      //Delete a stock from our collection
      var stocksymbol = $(e.target).attr('symbol');
      var removeModel = this.collection.where({symbol: stocksymbol});
      this.collection.remove(removeModel);
    }

  });

  window.PortfolioView = PortfolioView;
});
