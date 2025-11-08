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
  <v-carousel height="600" interval="10000" id="carousel-container">
    <v-carousel-item v-for="(item, i) in items" :src="cdn(item.image)" :key="i">

        <v-container fill-height style="max-width:100%" width="100%">
          <v-layout align-end justify-end>
            <v-flex lg8 xl6>
              <NewsItem :item="item" styling="margin: 20px" light color="rgba(255, 255, 255, 0.95)" raised hideImage/>
            </v-flex>
          </v-layout>
        </v-container>

    </v-carousel-item>
  </v-carousel>
`
});


Vue.component("HighlightedItem", {
  mixins: [ Content ],
  props: {
    "item"      : Object,
    "clazz"     : String
  },

  template: `
<v-card v-if="item" :class="clazz" :to="item.goto">
  <v-img :src="cdn(item.highlight_image)" aspect-ratio="1.75">
    <v-container fill-height style="max-width:100%" width="100%">
      <v-layout align-end>

  <v-card color="rgba(255,255,255,0.95)" light flat tile :to="'shop#'+item.id">
    <v-card-text>
      <h2>{{ item.title }}</h2>
      <v-btn color="primary" class="white--text" :to="item.goto">
        Shop nu
        <v-icon right dark>shopping_cart</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>

      </v-layout>
    </v-container>
  </v-img>
</v-card>
`
});

var FrontPage = {
  template : `
<Page>
    <v-layout row wrap>

      <!-- WELCOME -->

      <v-flex xs12 md4 d-flex>
        <v-sheet :class="margin + ' pa-3'" color="rgb(85,141,206,.10)">

          <h2 style="margin-bottom:5px">Uniek en Persoonlijk</h2>

          <p>

            Wat spreekt meer positiviteit uit dan een uniek en persoonlijk
            cadeau? Dat is wat Nation of Positivity biedt: tal van kleine leuke
            cadeautjes, allemaal uniek en gepersonaliseerd, bedoeld om jouw
            positiviteit aan iemand anders te geven (of gewoon om zelf van te
            genieten).

          </p>

          <p style="margin-bottom:0px">

            Met Nation of Positivity bied ik mijn atelier en creativiteit aan
            in deze kleine, online shop. Met liefde gemaakt om met heel veel
            liefde te kunnen geven. Zo zorgen we samen voor een beetje meer
            positiviteit in de wereld.

          </p>

          <v-img src="/app/static/images/christophe.png" width="75%" max-width="300px"/>

        </v-sheet>
      </v-flex>

     <!-- NEWS -->

      <v-flex xs12 md8>
        <v-sheet :class="margin">

          <NewsItemsAsCarousel class="hidden-sm-and-down"  :items="items"/>
          <NewsItemsAsList     class="hidden-md-and-up"    :items="items"/>

        </v-sheet>
      </v-flex>

    </v-layout>

    <!-- HIGHLIGHTS -->

    <v-layout row wrap>
      <v-flex d-flex v-for="(item, i) in highlights" :key="i" xs12 sm6 md4>
        <HighlightedItem :item="item" :clazz="margin"/>
      </v-flex>
    </v-layout>

</Page>
`,
  navigation: {
    section: null,
    icon:    "home",
    text:    "Welkom",
    path:    "/",
    index:   2
  },
  computed: {
    items: function() {
      return store.getters.news_items;
    },
    margin: function() {
      return this.$vuetify.breakpoint.smAndDown ? "ma-0 mb-2" : "ma-2";
    },
    highlights: function() {
      return store.getters.highlight_collections;
    }
  }
};

Navigation.add(FrontPage);
