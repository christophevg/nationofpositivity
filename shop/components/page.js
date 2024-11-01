Vue.component("Page", {
  template : `
<div>
  <v-alert v-model="banner.alert" :dismissible="banner.dismissible" :type="banner.type">{{ banner.message }}</v-alert>
  <div style="padding:0px;margin-bottom:15px">
    <slot></slot>
  </div>
  
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
            <v-btn dark icon href="https://facebook.com/NationOfPositivity" target="_blank">
              <i class="bi-twitter-x"/>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-card-actions class="grey darken-3 justify-center">
        <p style="text-align:center">
          <router-link style="color:white" to="/algemene-voorwaarden">Algemene voorwaarden</router-link> - <router-link style="color:white" to="/faq#privacy">Privacy</router-link> - <router-link style="color:white" to="/faq#cookies">Cookies</router-link><br>
          &copy;2024 — <strong>Nation of Positivity by 2Know - BE0865.835.163</strong>
        </p>
      </v-card-actions>

    </v-card>
  </v-footer>
  
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
