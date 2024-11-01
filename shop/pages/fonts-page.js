var FontsPage = {
  template : `
<Page>
  <v-layout row justify-center>

    <v-btn color="primary" dark @click="show_fonts_dialog">Open Dialog</v-btn>
  
  </v-layout>
</Page>
`,
  navigation: {
    section: null,
    icon:    "home",
    text:    "Lettertypes",
    path:    "/fonts",
    index:   4
  },
  methods: {
    show_fonts_dialog: function() {
      store.commit("show_font_selection");
    }
  },
  computed: {
    selected_font: function() {
      return store.getters.selected_font;
    }
  },
  data: function() {
    return {
      
    }
  }
};

Navigation.add(FontsPage)
