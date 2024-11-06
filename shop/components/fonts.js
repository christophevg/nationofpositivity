Vue.component("FontSelectionDialog", {
  mixins: [ Content ],
  template: `
  <v-dialog v-model="dialog" scrollable max-width="800px">
   <v-card>
      <v-card-title>Kies jouw favoriete lettertype...</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="max-height:500px;">

      <v-list>
        <v-list-tile v-for="(preview, index) in fonts" :key="index" @click="select(index)">

          <v-list-tile-action>
            <v-icon v-if="index == selected" color="pink">favorite</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-img :src="cdn('images/fonts/' + preview)" width="100%" position="left center"/>
          </v-list-tile-content>

        </v-list-tile>
      </v-list>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" flat @click="close">Sluit</v-btn>
        <v-btn color="primary"   flat @click="close" :disabled="selected == null">Kies</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
`,
  methods: {
    select: function(name) {
      store.commit("select_font", name);
    },
    close: function() {
      store.commit("hide_font_selection");
    }
  },
  computed: {
    fonts: function() {
      return store.getters.fonts;
    },
    dialog: {
      get() {
        return store.getters.font_selection_is_showing;
      },
      set(value) {
        if(value) {
          store.commit("show_font_selection");
        } else {
          store.commit("hide_font_selection");
        }
      }
    },
    selected: function() {
      return store.getters.selected_font;
    }
  }
});

store.registerModule("fonts", {
  state: {
    selected: null,
    dialog: false,
    fonts: {}
  },
  mutations: {
    fonts: function(state, index) {
      Vue.set(state, "fonts", index);
    },
    select_font: function(state, name) {
      state.selected = state.selected == name ? null : name;
    },
    show_font_selection(state) {
      state.dialog = true;
    },
    hide_font_selection(state) {
      state.dialog = false;
    }
  },
  getters: {
    fonts: function(state) {
      if(Object.keys(state.fonts).length === 0) {
        store.dispatch("refresh_fonts");
      }
      return state.fonts;
    },
    font_selection_is_showing: function(state) {
      return state.dialog;
    },
    selected_font: function(state) {
      return state.selected;
    }
  },
  actions: {
    refresh_fonts: function(context) {
      $.get({
        url: store.state.config.cdn + "/assets/images/fonts/index.json",
        success: function(response) {
          context.commit("fonts", response);
        }
      });
    }
  }
});

// form generator field

Vue.component("field-FontSelectionField",{
  mixins: [ VueFormGenerator.abstractField ],
  template: `
  <v-input append-icon="search" @click:append="select_font">
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
    // adopt the currently selected font as default value
    this.value = store.getters.selected_font;
    // and stay updated: subscribe to changes to the selected font
    var self = this;
    this.clean_up = store.subscribe((mutation, state) => {
      if([ "select_font" ].includes(mutation.type)) {
        self.value = state.fonts.selected;
      }
    });
  },
  beforeDestroy: function() {
    this.clean_up();
    this.clean_up = null;
  },
  methods: {
    select_font: function() {
      store.commit("show_font_selection");
    }
  },
  data: function() {
    return {
      clean_up: null
    }
  }
});
