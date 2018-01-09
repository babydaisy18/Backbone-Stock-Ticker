$(function () {
  var ClientModel = Backbone.Model.extend({
    defaults: {
      hostname: 'https://cis197-backbone-server.herokuapp.com',
      updateList: []
    },
    initialize: function () {
      var socket = io.connect(this.get('hostname'));
      this.set('socket', socket);
      socket.on('connect', function () {
        console.log('Connected to real time server!');
      });
      socket.on('update', function () {
        this.updateModels();
      }.bind(this));
    },
    updateModels: function () {
      var models = _.chain(this.get('updateList'))
        .map(function (modelOrCollection) {
          if (modelOrCollection instanceof Backbone.Model) {
            return modelOrCollection;
          } else if (modelOrCollection instanceof Backbone.Collection) {
            return modelOrCollection.models;
          } else {
            console.error('Object that was not a Backbone collection or model passed to ticker client.');
            return [];
          }
        })
        .flatten()
        .value();
      symbols = models.map(function (model) {
        return model.get('symbol');
      });
      this.get('socket').emit('stockData', symbols, function (data) {
        var zipped = _.zip(models, data);
        zipped.map(function (modelThenDatum) {
          var model = modelThenDatum[0];
          var datum = modelThenDatum[1];
          model.set('price', datum.price);
        });
      });
    },
    listenForPriceUpdates: function (modelOrCollection) {
      this.get('updateList').push(modelOrCollection);
    },
    clearListening: function () {
      this.set('updateList', []);
    },
    searchStock: function (query, cb) {
      this.get('socket').emit('searchStock', query, cb);
    }
  });

  window.ClientModel = ClientModel;
});
