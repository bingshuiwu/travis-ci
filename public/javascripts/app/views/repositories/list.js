Travis.Views.Repositories.List = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'elementAdded', 'collectionRefreshed');
    this.template = Travis.templates['repositories/list']
  },
  detach: function() {
    if(this.collection) {
      this.collection.unbind('add', this.elementAdded);
      this.collection.unbind('refresh', this.collectionRefreshed);
    }
  },
  attachTo: function(collection) {
    this.detach();
    this.collection = collection;
    this.collection.bind('add', this.elementAdded);
    this.collection.bind('refresh', this.collectionRefreshed);
  },
  render: function() {
    this.el = $(this.template({}));
    return this;
  },
  elementAdded: function(element) {
    this.el.prepend(this._renderItem(element));
  },
  collectionRefreshed: function() {
    this.el.empty();
    this.collection.each(function(element) {
      this.el.prepend(this._renderItem(element));
    }.bind(this));
  },
  _renderItem: function(element) {
    return new Travis.Views.Repositories.Item({ model: element }).render().el
  }
});

Travis.Views.Repositories.MyList = Backbone.View.extend({
  constructor: function(el, collection) {
    this.el = el
    this.collection = collection
    this.initialize()
  },
  initialize: function() {
    _.bindAll(this, 'render', 'renderItem');
    this.template = Travis.templates['repositories/my']
    this.collection.fetch({ success: this.render })
  },
  render: function() {
    this.el.html(this.template({}))
    _.each(this.collection.sortBy( function(a,b) {
      return a.get('travis_enabled');
    }), _.bind(function(item) {
      this.el.find("#my_repositories").append(this.renderItem(item))
    }, this))
    return this;
  },
  renderItem: function(item) {
    return new Travis.Views.Repositories.MyItem({ model: item }).render().el
  }
});
