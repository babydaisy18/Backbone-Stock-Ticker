$(function () {
  var SingleStockView = Backbone.View.extend({
    className: 'single-stock',
    template: Handlebars.compile($('#single-stock-template').html()),
    initialize: function () {
      //Set up the view to listen to its backing model
      this.listenTo(this.model, 'change', this.onChange);

    },

    onChange: function () {
      //Set what happens when changes are made
      this.render();
    },

    render: function () {
      //Render this view using its model's data
      var current = this.template(this.model.toJSON());
      this.$el.html(current);
    }

  });

  window.SingleStockView = SingleStockView;
});
