Vue.component("Page", {
  template : `
<div>
  <v-alert v-model="banner.alert" :dismissible="banner.dismissible" :type="banner.type">{{ banner.message }}</v-alert>
  <div style="padding:15px">
    <slot></slot>
  </div>
</div>
`,
  computed: {
    banner: function() {
      return store.state.allpages.banner;
    }
  }
});

store.registerModule("allpages", {
  state: {
    banner : {
      alert:       false,
      dismissible: true,
      type:        "success",
      message:     "OK"
    }
  },
  mutations: {
    banner: function(state, banner) {
      if( "alert"   in banner) { state.banner.alert   = banner.alert   }
      if( "type"    in banner) { state.banner.type    = banner.type    }
      if( "message" in banner) { state.banner.message = banner.message }
    }
  }
});

if( store.state.config.mode != "production" ) {
  store.commit("banner", {
    "alert"   : true,
    "type"    : "warning",
    "message" : "De website werkt in " + store.state.config.mode + " modus." +
                (store.state.config.mode_message ? " " + store.state.config.mode_message : "")
  });
}
