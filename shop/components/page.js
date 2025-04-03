Vue.component("Page", {
  props: {
    "nogoto": Boolean
  },
  template : `
<div>
  <v-alert v-model="banner.alert" :dismissible="banner.dismissible" :type="banner.type"">
    <span v-html="banner.message"/>
  </v-alert>
  <div style="padding:0px;margin-bottom:15px">
    <slot></slot>
  </div>
  
  <FontSelectionDialog/>
  <StyleSelectionDialog/>
  
  <v-footer dark height="auto">
    <v-card class="flex" flat tile>
      <v-card-title style="background-color:rgb(85,141,206)">

        <v-layout row wrap>
          <v-flex xs12 sm6 align-self-center :style="$vuetify.breakpoint.xs ? 'text-align:center' : ''">
            <strong class="subheading">Volg onze socials...</strong>
          </v-flex>

          <v-flex xs12 sm6 :style="$vuetify.breakpoint.xs ? 'text-align:center' : 'text-align:right'">
            <v-btn dark icon href="https://instagram.com/NationOfPositivity" target="_blank">
              <i class="bi-instagram"/>
            </v-btn>
            <v-btn dark icon href="https://facebook.com/NationOfPositivity" target="_blank">
              <i class="bi-facebook"/>
            </v-btn>
            <v-btn dark icon href="https://www.linkedin.com/company/nationofpositivity" target="_blank">
              <i class="bi-linkedin"/>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-card-actions class="grey darken-3 justify-center">
        <p style="text-align:center">
          <router-link style="color:white" to="/algemene-voorwaarden">Algemene voorwaarden</router-link> - <router-link style="color:white" to="/faq#privacy">Privacy</router-link> - <router-link style="color:white" to="/faq#cookies">Cookies</router-link><br>
          &copy;2024-2025 — <strong>Nation of Positivity</strong> - <strong><a href="https://homemadebycvg.com" target="_blank" style="color:white">homemade by CVG</a></strong> - supported by <strong><a href="https://2know.be" target="_blank" style="color:white">2Know</a></strong> - BE0865.835.163</strong>
        </p>
      </v-card-actions>

    </v-card>
  </v-footer>
  
</div>
`,
  mounted: function() {
    if(this.nogoto) { return; }

    // ensure pages are always scrolled back to the top
    // IF there is no anchor, else explicitly go there
    if(window.location.hash == "") {
      this.$vuetify.goTo(0);
    } else {
      this.$vuetify.goTo(window.location.hash, {offset: 20});
    }
  },
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
