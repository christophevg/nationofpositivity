Vue.component("StyleSelectionDialog", {
  mixins: [ Content ],
  template: `
  <v-dialog v-model="dialog" v-if="dialog" scrollable max-width="800px">
   <v-card>
      <v-card-title>Kies jouw favoriete opmaakstijl...</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="max-height:500px;">

      <v-list three-line>
        <v-list-tile v-for="style in styles" :key="style.name" @click="select(style.name)">

          <v-list-tile-action>
            <v-icon v-if="style.name == selected" color="pink">favorite</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-img :src="cdn('images/styles/' + style.preview)" width="100%" position="left center"/>
          </v-list-tile-content>

        </v-list-tile>
      </v-list>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="close">Ok</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
`,
  methods: {
    select: function(name) {
      store.commit("select_style", name);
    },
    close: function() {
      store.commit("hide_style_selection");
    }
  },
  computed: {
    styles: function() {
      return store.getters.styles;
    },
    dialog: {
      get() {
        return store.getters.style_selection_is_showing;
      },
      set(showing) {
        if(showing) {
          store.commit("show_style_selection");
        } else {
          store.commit("hide_style_selection");
        }
      }
    },
    selected: function() {
      return store.getters.selected_style;
    }
  }
});

store.registerModule("styles", {
  state: {
    selected: null,
    dialog: false,
    styles: []
  },
  mutations: {
    initialise_favorite_style: function(state) {
      var favorite = localStorage.getItem("style");
      if(favorite && favorite != "null") {
        state.selected = favorite;
      }
    },
    styles: function(state, index) {
      state.styles.splice(0);                                       // clear
      Object.keys(index).forEach(                                   // transform
        (key) => state.styles.push({ name: key, preview: index[key]})
      );
      // state.styles.sort((a, b) => a.name.localeCompare(b.name));     // sort
    },
    select_style: function(state, name) {
      state.selected = state.selected == name ? null : name;
      localStorage.setItem("style", state.selected);
    },
    show_style_selection(state) {
      state.dialog = true;
    },
    hide_style_selection(state) {
      state.dialog = false;
    }
  },
  getters: {
    styles: function(state) {
      if(Object.keys(state.styles).length === 0) {
        store.dispatch("refresh_styles");
      }
      return state.styles;
    },
    style_selection_is_showing: function(state) {
      return state.dialog;
    },
    selected_style: function(state) {
      return state.selected;
    }
  },
  actions: {
    refresh_styles: function(context) {
      $.get({
        url: store.state.config.cdn + "/assets/images/styles/index.json",
        success: function(response) {
          console.log("got", response);
          context.commit("styles", response);
        }
      });
    }
  }
});

before_app_mount( function() { store.commit("initialise_favorite_style"); } );

// form generator field

Vue.component("field-StyleSelectionField",{
  mixins: [ VueFormGenerator.abstractField ],
  template: `
  <v-input append-icon="search" @click:append="select_style">
    <input
        class="form-control"
        type="text"
        v-model="value"
        :disabled="disabled"
        :maxlength="schema.max"
        :placeholder="schema.placeholder"
        :readonly="schema.readonly"/>
  </v-input>
`,
  mounted: function() {
    // adopt the currently selected style as default value
    this.value = store.getters.selected_style;
    // and stay updated: subscribe to changes to the selected style
    var self = this;
    this.clean_up = store.subscribe((mutation, state) => {
      if([ "select_style" ].includes(mutation.type)) {
        self.value = state.styles.selected;
      }
    });
  },
  beforeDestroy: function() {
    this.clean_up();
    this.clean_up = null;
  },
  methods: {
    select_style: function() {
      store.commit("show_style_selection");
    }
  },
  data: function() {
    return {
      clean_up: null
    }
  }
});
