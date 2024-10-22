store.registerModule("products", {
  state: {
    products: [],
    selected: null
  },
  mutations: {
    products: function(state, products) {
      state.products = products;
    },
    selected: function(state, product) {
      state.selected = product;
    }
  },
  getters: {
    matching_products: function(state) {
      return state.products;
    }
  },
  actions: {
    search: function(context) {
      $.get({
        url: "/api/products",
        success: function(response) {
          context.commit("products", response.content);
        }
      });
    },
    select: function(context, id) {
      // do we have it in the current products cache?
      var matches = context.state.products.filter(function(product){
        return product.id == id;
      });
      if(matches.length > 0) {
        context.commit("selected", matches[0]);
      } else {
        $.get({
          url: "/api/products/" + id,
          success: function(response) {
            context.commit("selected", response);
          },
          error: function(response) {
            context.commit("selected", response);
          }
        }); 
      }
    }
  }
});

