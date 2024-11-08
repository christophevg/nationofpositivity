Vue.component("NewsItem", {
  mixins: [ Content ],
  props: [ "item" ],
  template: `
<v-card class="mb-3" v-if="item">
  <v-img :src="cdn(item.image)" aspect-ratio="2"></v-img>
  <v-card-title primary-title>
    <div>
      <h3 class="headline mb-0">{{ item.title }}</h3>
      <h2><v-icon>event</v-icon>&nbsp;&nbsp;{{ item.when | formatDate }}</h2>
      <div style="padding-top:10px">
        <p v-for="(para, p) in item.body.split(/\\n\\s*\\n/)" :key="p"
           v-html="para"></p>
      </div>
    </div>
  </v-card-title>
</v-card>
`
});

var Index = {
  mixins: [ Content ],
  template : `
<Page>
  <v-layout justify-center row fill-height>
    <v-flex xs12 sm6 md8>
      <NewsItem v-for="(item, i) in items" :key="i" :item="item"/>
    </v-flex>
  </v-layout>  
</Page>
`,
  navigation: {
    section: null,
    icon:    "home",
    text:    "Welkom",
    path:    "/",
    index:   1
  },
  computed: {
    items: function() {
      return store.getters.news_items
    }
  }
};

Navigation.add(Index);
