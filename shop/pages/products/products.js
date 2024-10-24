var Catalogue = {
  template : `
<Page>

  <v-container grid-list-md>

    <!-- introductie -->

    <v-layout row wrap>
     <v-flex xs12>
      <v-card xs12 key="search">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Shop Positivity</h3>
            <div>
  
Hieronder vind je een groeiende collectie aan leuke dingen met een hoge positiviteit-factor<br><br>
<ul>
  <li>Je kan ze onmiddellijk aan je mandje toevoegen, of in meer detail bestuderen.</li>
  <li>De meeste kunnen gepersonaliseerd worden. Instructies staan op de product pagina.</li>
</ul>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
    </v-layout>
    

    <!-- search disable until needed

    <v-layout row wrap>
     <v-flex xs12>
      <v-card xs12 key="search">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Search...</h3>
            <h3>TODO</h3>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
    </v-layout>

    -->

    <v-layout row wrap>
      <v-flex v-for="(product, i) in matching_products" :key="i" xs12 sm6 md4>
        <ProductCard :product="product"/>
      </v-flex>
    </v-layout>
  </v-container>

</Page>
`,
  navigation: {
    section: null,
    icon:    "search",
    text:    "Shop Positivity",
    path:    "/shop",
    index:   2
  },
  created: function() {
    store.dispatch("search");
  },
  computed : {
    matching_products : function() {
      return store.getters.matching_products;
    }
  }
};

Navigation.add(Catalogue);
