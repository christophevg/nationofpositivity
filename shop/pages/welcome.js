Vue.component("NewsItem", {
  mixins: [ Content ],
  props: {
    "item"      : Object,
    "hideImage" : Boolean,
    "clazz"     : String,
    "styling"   : String,
    "color"     : String,
    "light"     : Boolean,
    "raised"    : Boolean
  },
  
  template: `
<v-card v-if="item" :class="clazz" :style="styling" :color="color" :light="light" :raised="raised">
  <v-img :src="cdn(item.image)" aspect-ratio="1.75" v-if="!hideImage"/>
  <v-card-text>
    <div>
      <h3 :class="{'title mb-0'      : $vuetify.breakpoint.smAndDown, 'headline mb-0': $vuetify.breakpoint.mdAndUp }">{{ item.title }}</h3>
      <h2 :class="{'subheading mb-0' : $vuetify.breakpoint.smAndDown }"><v-icon>event</v-icon>&nbsp;&nbsp;{{ item.when | formatDate }}</h2>

      <div style="padding-top:10px">
        <p v-for="(para, p) in item.body.split(/\\n\\s*\\n/)" :key="p" v-html="para"/>
      </div>
    </div>
  </v-card-text>
</v-card>
`
});

Vue.component("NewsItemsAsList", {
  props: [ "items" ],
  template: `
    <v-flex xs12>
      <NewsItem v-for="(item, i) in items" :key="i" :item="item" clazz="mb-3"/>
    </v-flex>
`
});

Vue.component("NewsItemsAsCarousel", {
  mixins: [ Content ],
  props: [ "items" ],
  template: `
    <v-flex xs12>
      <v-carousel height="700" interval="30000">
        <v-carousel-item v-for="(item,i) in items" :key="i" :src="cdn(item.image)">
          <v-flex xs12 md8 xl6>
            <NewsItem :item="item" styling="margin: 20px" light color="rgba(255, 255, 255, 0.95)" raised hideImage/>
          </v-flex>
        </v-carousel-item>
      </v-carousel>

    </v-flex>
`
});


var Index = {
  mixins: [ Content ],
  template : `
<Page>
  <NewsItemsAsCarousel class="hidden-sm-and-down"  :items="items"/>
  <NewsItemsAsList     class="hidden-md-and-up"    :items="items"/>
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
