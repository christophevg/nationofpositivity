var Shop = {
  template : `
<Page>

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
            <v-chip v-for="tag in possible_filters" :key="tag"
                    :outline="!current_filters.includes(tag)"
                    :close="current_filters.includes(tag)"
                    :color="current_filters.includes(tag) ? 'rgb(85,141,206)' : 'grey'"
                    :text-color="current_filters.includes(tag) ? 'white' : 'black'"
                    @input="remove_filter(tag)" @click="add_filter(tag);"
                    class="cursor-pointer"
                    >{{ tag }}</v-chip>
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
    store.dispatch("search");
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
    possible_filters: function() {
      return store.getters.possible_filters;
    },
    current_filters: function() {
      return store.getters.current_filters;
    },
    matching_products : function() {
      return store.getters.matching_products;
    }
  }
};

Navigation.add(Shop);
