$(function () {
  var PortfolioView = Backbone.View.extend({
    className: 'portfolio-container',
    template: Handlebars.compile($('#portfolio-template').html()),
    initialize: function () {
      //Set up event listeners.
      this.listenTo(this.collection, 'add', this.onChange);
      this.listenTo(this.collection, 'remove', this.onChange);
      this.listenTo(this.collection, 'change', this.onChange);

      // You need to run the onChange function whenever the underlying collection
      // changes (including additions and removals).
    },

    events: {
      //Define events
      //FIX THIS BUTTON TRIGGER - class selector should be enough
      'click .delete-stock' : 'deleteStock'

    },

    onChange: function () {
      //Set what happens when changes are made
      this.render();
    },

    render: function () {
      //Render the portfolio that houses all of the added stocks
      //this.toJSON() or StockCollection.toJSON()???
      var collectionConverted = this.collection.toJSON();
      var current = this.template({stocks: collectionConverted});
      this.$el.html(current);
    },

    deleteStock: function (e) {
      //Delete a stock from our collection
      var stocksymbol = $(e.target).attr('symbol');
      var removeModel = this.collection.where({symbol: stocksymbol});
      //var removeModel = PortfolioCollection.where(temp);
      this.collection.remove(removeModel);
    }

  });

  window.PortfolioView = PortfolioView;
});
