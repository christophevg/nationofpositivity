store.registerModule("products", {
  state: {
    collections : [],
    searching: false,
    filters: [],
    possible_sorting: [
      "oplopende prijs",
      "aflopende prijs",
      "volgens naam"
    ],
    sorting_functions: [
      function(a, b) { return a.unit_price - b.unit_price; },
      function(a, b) { return b.unit_price - a.unit_price; },
      function(a, b) { return a.title < b.title }
    ],
    sorting: 0,
    products: [],
    selected: null
  },
  mutations: {
    start_searching: function(state) {
      state.searching = true;
    },
    stop_searching: function(state) {
      state.searching = false;
    },
    filters: function(state, filters) {
      state.filters = filters;
      window.location.hash = filters.join(",").replaceAll(" ", "-");
    },
    sorting: function(state, sorting) {
      var index = state.possible_sorting.findIndex((item) => item == sorting);
      if(index > -1) {
        state.sorting = index;
      }
    },
    collections: function(state, collections) {
      state.collections = collections;
    },
    products: function(state, products) {
      state.products = products;
      state.searching = false;
    },
    selected: function(state, product) {
      state.selected = product;
    }
  },
  getters: {
    searching: function(state) {
      return state.searching;
    },
    possible_filters: function(state) {
      return state.products.reduce(function(acc, product) {
        return [...new Set([...acc, ...product.tags])]
      }, []);
    },
    collections: function(state) {
      return state.collections;
    },
    possible_collections: function(state, getters) {
      return getters.possible_filters.filter(function(filter) {
        return getters.collections.find(function(collection){
          return collection.title.toLowerCase() == filter;
        });
      });
    },
    possible_tags: function(state, getters) {
      return getters.possible_filters.filter(function(filter) {
        return ! getters.collections.find(function(collection){
          return collection.title.toLowerCase() == filter;
        });
      });
    },
    highlight_collections: function(state, getters) {
      return getters.collections.filter(function(collection) {
        return collection.highlight == true;
      })
    },
    current_filters: function(state) {
      return state.filters;
    },
    possible_sorting: function(state) {
      return state.possible_sorting;
    },
    current_sorting: function(state, getters) {
      return getters.possible_sorting[state.sorting];
    },
    matching_products: function(state) {
      return [...state.products].sort(state.sorting_functions[state.sorting]);
    }
  },
  actions: {
    load_collections: function(context) {
      $.get({
        url: "/api/collections",
        success: function(response) {
          context.commit("collections", response.content);
        },
        failure: function(response) {
          // whoops ;-)
        }
      })
    },
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
    change_sorting: function(context, sorting) {
      context.commit("sorting", sorting);
    },
    search: function(context, filters=[]) {
      context.commit("start_searching");
      var query = filters.length > 0 ? "?tags=" + encodeURI(filters.join(",")) : "";
      $.get({
        url: "/api/products" + query,
        success: function(response) {
          context.commit("products", response.content);
          context.commit("filters", filters);
        },
        failure: function(response) {
          context.commit("stop_searching");
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

before_app_mount( function() { store.dispatch("load_collections"); } );
