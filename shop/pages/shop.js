var Shop = {
  template : `
<Page nogoto>

  <v-container grid-list-md style="padding:0px;">

    <!-- introductie -->

    <v-layout row wrap>
     <v-flex xs12>
      <v-card xs12>
        <v-card-text>
          <h3 class="headline mb-0">Shop positiviteit</h3>
          <p>
          
            Filter, sorteer, klik door naar de productpagina of voeg direct
            toe aan je mandje. Hier vind je jouw positief cadeautje!
          
          </p>

          <!-- ACTIVITY / RESULTS -->
  
          <div class="text-xs-center" style="padding:15px" v-if="matching_products.length < 1">

            <p v-if="searching">
              🙌 Dat zoek ik even voor je...
            </p>

            <p v-if="!searching">
              🥺 Sorry, ik heb niets gevonden... <a href="">Bekijk alles</a>.
            </p>
  
          </div>
  
          <div class="text-xs-center" v-if="matching_products.length > 0">
  
            <!-- FILTERS -->
  
            <v-chip v-for="tag in possible_filters" :key="tag"
                    :outline="!current_filters.includes(tag)"
                    :close="current_filters.includes(tag)"
                    :color="current_filters.includes(tag) ? 'rgb(85,141,206)' : 'grey'"
                    :text-color="current_filters.includes(tag) ? 'white' : 'black'"
                    @input="remove_filter(tag)" @click="add_filter(tag);"
                    class="cursor-pointer"
                    >{{ tag }}</v-chip>

            <!-- SORTING -->

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
