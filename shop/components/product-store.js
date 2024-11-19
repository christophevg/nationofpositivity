store.registerModule("products", {
  state: {
    filters: [],
    products: [],
    selected: null
  },
  mutations: {
    filters: function(state, filters) {
      state.filters = filters;
    },
    products: function(state, products) {
      state.products = products;
    },
    selected: function(state, product) {
      state.selected = product;
    }
  },
  getters: {
    possible_filters: function(state) {
      return state.products.reduce(function(acc, product) {
        return [...new Set([...acc, ...product.tags])]
      }, []);
    },
    current_filters: function(state) {
      return state.filters;
    },
    matching_products: function(state) {
      return state.products;
    }
  },
  actions: {
    add_filter: function(context, tag) {
      var filters = [...new Set([...context.getters.current_filters, ...[tag]])];
      context.dispatch("search", filters);
    },
    remove_filter: function(context, tag) {
      var filters = context.getters.current_filters.filter(function(current){
        return current != tag;
      });
      context.dispatch("search", filters);
    },
    search: function(context, filters=[]) {
      var query = filters.length > 0 ? "?tags=" + encodeURI(filters.join(",")) : "";
      $.get({
        url: "/api/products" + query,
        success: function(response) {
          context.commit("products", response.content);
          context.commit("filters", filters);
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

