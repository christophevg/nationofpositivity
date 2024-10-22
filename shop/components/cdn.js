var Content = Vue.component("Content", {
  computed: {
    "cdn" : function() {
      return function(path) {
        return store.getters.cdn_url(path);
      }
    }
  },
});

store.registerModule("cdn", {
  state: {
    index: [],
  },
  mutations: {
    index: function(state, index) {
      state.index = index;
    }
  },
  getters: {
    cdn_url: function(state) {
      return function(path) {
        var parts = path.split("/"),
            filename = parts.pop(),
            ptr = state.index;
        for(var i=0; i<parts.length; i++) {
          var step = parts[i];
          if( step in ptr ) {
            ptr = ptr[step];
          } else {
            break;
          }
        }
        if(filename in ptr) {
          return store.state.config.cdn + "/assets/" + path;
        } else {
          return "/app/static/images/placeholder.png";
        }
      }
    }
  },
  actions: {
    refresh: function(context) {
      $.get({
        url: store.state.config.cdn + "/index.json",
        success: function(response) {
          context.commit("index", response.assets);
          console.log("🌇 loading content from", store.state.config.cdn);
        }
      });
    }
  }
});

before_app_mount( function() { store.dispatch("refresh"); } );
