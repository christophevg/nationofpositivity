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
    index: {},
    flat_index: []
  },
  mutations: {
    index: function(state, index) {
      function flatten(obj, prefix, lst) {
        for(var key in obj) {
          if(key == "_files") {
            for(var file in obj[key]) {
              lst.push(prefix + "/" + obj[key][file]);
            }
          } else {
            if(typeof obj[key] === 'object') {
              flatten(obj[key], prefix + "/" + key, lst);
            }
          }
        }
      }
      
      Vue.set(state, "index", index);
      flatten(index, "", state.flat_index);
    }
  },
  getters: {
    cdn_url: function(state) {
      return function(path) {
        var parts = path.split("/"),
            filename = parts.pop(),
            ptr = state.index;
        if(parts[0] == "") {
          parts.shift();
        }
        parts.push("_files");
        for(var i=0; i<parts.length; i++) {
          var step = parts[i];
          if( step in ptr ) {
            ptr = ptr[step];
          } else {
            break;
          }
        }
        if(ptr.includes(filename)) {
          return store.state.config.cdn + "/assets/" + path;
        } else {
          return "/app/static/images/placeholder.png";
        }
      }
    },
    images: function(state) {
      return function() {
        return state.flat_index;
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
