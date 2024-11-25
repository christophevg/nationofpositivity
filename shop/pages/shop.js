var Shop = {
  template : `
<Page nogoto>

  <v-container grid-list-md style="padding:0px;">

    <!-- introductie -->

    <v-layout row wrap>
     <v-flex xs12>
      <v-card xs12>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Shop positiviteit</h3>
            <div>
  
In de shop vind je een groeiend aantal aan leuke dingen met een hoge
positiviteit-factor. We voegen op regelmatige basis nieuwe spulletjes toe.<br>
  
Volg zeker onze socials om op de hoogte te blijven van de nieuwigheden!

<br><br>

<ul>
  <li>Je kan ze onmiddellijk aan je mandje toevoegen, of eerst in meer detail bestuderen.</li>
  <li>Je kan ze allemaal personaliseren. De instructies daarvoor vind je op de product pagina.</li>
</ul>

<br>

Veel plezier met het schenken van wat extra positiviteit!

            </div>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
    </v-layout>
    
    
    <v-layout row wrap>
     <v-flex xs12>
      <v-card xs12>
        <v-card-text>
         <div class="text-xs-center" style="padding:15px">
            <p v-if="searching && matching_products.length < 1">
              🙌 Dat zoek ik even voor je...
            </p>
            <p v-if="!searching && matching_products.length < 1">
              🥺 Sorry, ik heb niets gevonden... <a href="">Bekijk alles</a>.
            </p>
            <v-chip v-for="tag in possible_filters" :key="tag"
                    :outline="!current_filters.includes(tag)"
                    :close="current_filters.includes(tag)"
                    :color="current_filters.includes(tag) ? 'rgb(85,141,206)' : 'grey'"
                    :text-color="current_filters.includes(tag) ? 'white' : 'black'"
                    @input="remove_filter(tag)" @click="add_filter(tag);"
                    class="cursor-pointer"
                    >{{ tag }}</v-chip>

          <div style="display:inline-block;position:relative;top:5px">
            <v-select
              :items="possible_sorting"
              v-model="current_sorting"
              style="min-width: min-content;"
              prepend-icon="sort"
              hide-details
              solo
              dense
              flat
              />
          </div>

          </div>
        </v-card-text>
      </v-card>
    </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex d-flex v-for="(product, i) in matching_products" :key="i" xs12 sm6 md4>
        <ProductCard :product="product"/>
      </v-flex>
    </v-layout>
  </v-container>

</Page>
`,
  navigation: {
    section: null,
    icon:    "search",
    text:    "Shop positiviteit",
    path:    "/shop",
    index:   2
  },
  mounted: function() {
    this.$vuetify.goTo(0);
    if(window.location.hash != "") {
      store.dispatch("search", window.location.hash.substring(1).replaceAll("-", " ").split(","));
    } else {
      store.dispatch("search");
    }
  },
  methods: {
    add_filter: function(tag) {
      store.dispatch("add_filter", tag);
    },
    remove_filter: function(tag) {
      store.dispatch("remove_filter", tag);
    }
  },
  computed : {
    searching: function() {
      return store.getters.searching;
    },
    possible_filters: function() {
      return store.getters.possible_filters;
    },
    current_filters: function() {
      return store.getters.current_filters;
    },
    possible_sorting: function() {
      return store.getters.possible_sorting;
    },
    current_sorting: {
      get() {
        return store.getters.current_sorting;
      },
      set(sorting) {
        store.dispatch("change_sorting", sorting);
      }
    },
    matching_products : function() {
      return store.getters.matching_products;
    }
  }
};

Navigation.add(Shop);
