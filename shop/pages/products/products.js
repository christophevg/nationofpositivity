var Catalogue = {
  template : `
<Page>

  <v-container grid-list-md style="padding:0px;">

    <!-- introductie -->

    <v-layout row wrap>
     <v-flex xs12>
      <v-card xs12 key="search">
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
    text:    "Shop positiviteit",
    path:    "/shop",
    index:   2
  },
  mounted: function() {
    store.dispatch("search");
  },
  computed : {
    matching_products : function() {
      return store.getters.matching_products;
    }
  }
};

Navigation.add(Catalogue);
