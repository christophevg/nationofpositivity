Vue.component("ProductConfigurator", {
  mixins: [ Content ],
  props: {
    product: Object
  },
  template: `
<div>

  <v-card-title>

    <div style="width:100%">
      <h3 class="headline mb-0">Prijs: &euro; {{ unit_price | fixed2 }}</h3>
      <span class="grey--text">(inclusief &euro; {{ unit_tax | fixed2 }} BTW)</span>

      <h3 class="subheading mt-2" v-if="have_options">Personaliseer jouw positiviteit</h3>
      <vue-form-generator :schema="schema" :model="model.options" :options="formOptions"
                          @validated="onValidated"/>
          
      <h3 class="subheading grey--text">Kosten voor verzending : &euro; {{ product_shipping_price | fixed2 }}</h3>
      <span class="grey--text">De exacte leveringskost wordt in je mandje bepaald, op basis van de volledige bestelling.</span> 
    
    </div>

  </v-card-title>

  <v-card-actions>

    <v-spacer></v-spacer>

    <v-btn :disabled="!ready_to_add" color="primary" v-on:click.prevent @click="add">
      <v-icon>add_shopping_cart</v-icon>
      &nbsp;&nbsp;Ja, dit wil ik!
    </v-btn>

    <v-spacer></v-spacer>

  </v-card-actions>

</div>
`,
  computed: {
    schema: function() {
      return {
        fields: !this.product.options ?
          []
          :
          this.product.options.map(function(field) {
            // translate validate(string) -> validator
            if(field.validate) {
              field.validator = VueFormGenerator.validators[field.validate];
            }
            // ensure all validators have NL locale
            if(field.validator) {
              field.validator = field.validator.locale(nl);
            }
            return field;
          })
      }
    },
    have_options: function() {
      return this.product.options && this.product.options.length > 0;
    },
    selected_options: function() {
      var self = this;
      return Object.keys(this.model.options).map(function(id){
        if(self.model.options[id] == null) { return null; }
        if(self.model.options[id] == "")   { return null; }
        if(self.model.options[id].cost !== undefined ) {
          return { "option" : id, "choice" : self.model.options[id].choice, "cost" : self.model.options[id].cost };
        } else {
          // e.g. for simple text
          return { "option" : id, "choice" : self.model.options[id], "cost" : 0 };
        }
      }).filter(function(option){
        return option != null;
      });
    },
    unit_price: function() {
      return this.product.unit_price + this.selected_options.reduce(function(total, option){
        return total + option.cost;
      }, 0.0);
    },
    unit_tax: function() {
      return this.unit_price - this.unit_price / 1.21;
    },
    product_shipping_price: function() {
      return store.getters.base_shipping_cost(this.product.shipping);
    },
    ready_to_add: function() {
      return (! this.have_options ) || this.options_are_valid;
    }
  },
  methods: {
    add : function() {
      this.$emit("add", this.selected_options);
    },
    onValidated: function(is_valid, errors) {
      this.options_are_valid = is_valid;
    }
  },
  data: function() {
    return {
      model : {
        options : {}
      },
      options_are_valid : false,
      formOptions: {
        validateAfterLoad:    true,
        validateAfterChanged: true
      }
    }
  }
});

Vue.component("ProductCard", {
  mixins: [ Content ],
  props: {
    product : Object,
    nolink: Boolean,
    layout: {
      validator(value) {
        return ["page", "card"].includes(value)
      },
      default() {
        return "card"
      }
    }
  },
  template: `
<div>
  <div v-if="product == null || is_error">
    <div v-if="product == null">
      Ok, dit product wordt geladen...
    </div>

    <div v-if="is_error">
      Whoops, dat product lijkt niet te bestaan...
    </div>
  </div>
  
  <v-card v-else :to="link_to" tile height="100%" style="margin-right: 3px;">

      <v-img v-if="(card_layout && header.images.length >= 1) || (page_layout && header.images.length == 1)"
             :src="cdn(header.card.image)"
             :height="header.height"
             @click.native="show_image(0)"
             style="text-align:right;">
        <v-btn flat icon color="white" v-on:click.prevent @click="show_image(0)">
          <v-icon>search</v-icon>
        </v-btn>
      </v-img>

      <v-carousel :height="header.height" v-if="page_layout && header.images.length >= 2" hide-delimiters :cycle="false" v-model="showing_image">
        <v-carousel-item v-for="(item,i) in header.images" :key="i" :src="cdn(item)" @click.native="show_image(i)" style="text-align:right;">
          <v-btn flat fab dark large color="white" v-on:click.prevent @click="show_image(i)">
            <v-icon>search</v-icon>
          </v-btn>
        </v-carousel-item>
      </v-carousel>

      <v-dialog v-if="card_layout" v-model="options_dialog" max-width="600px">
        <v-card>
          <ProductConfigurator v-if="card_layout && options_dialog" :product="product" @add="add"/>
        </v-card>
      </v-dialog>

      <v-layout row wrap>

        <v-flex v-bind="info_flex">

          <v-card-text primary-title>
            <h3 class="headline mb-0">{{ product.title }}</h3>

            <h3 v-if="card_layout">&euro; {{ product.unit_price | fixed2 }}</h3>

            <p v-html="html_intro"></p>

            <div v-if="page_layout">
              <p v-html="html_description"></p>
              <div v-if="product.specifications" class="mb-3">
                <h3 class="subheading mb-1 mt-3">Eigenschappen</h3>
                <p>
                <template v-for="(value, spec) in product.specifications">
                  {{ spec }}: {{ value }}<br>
                </template>
                </p>
              </div>
              <v-chip v-for="tag in product.tags" :key="tag" outline color="grey" text-color="black">{{ tag }}</v-chip>
            </div>
          </v-card-text>

        </v-flex>

        <v-flex xs12 v-if="card_layout">
                    
          <v-card-actions style="position: absolute; bottom: 0; right:0; width: 100%;">

            <v-spacer></v-spacer>

            <v-btn flat color="primary" v-on:click.prevent @click="have_options ? show_configurator() : add()">
              <v-icon>add_shopping_cart</v-icon>
              &nbsp;&nbsp;Ja, dit wil ik!
            </v-btn>
          </v-card-actions>

        </v-flex>
                   
        <v-flex xs12 md3 v-if="page_layout">
          <ProductConfigurator :product="product" @add="add"/>
        </v-flex>

      </v-layout>

    <v-dialog v-model="next" persistent max-width="600">
      <v-card>
        <v-card-title>
          <h3 class="headline mb-0">YES!</h3>
        </v-card-title>

        <v-card-text>
  
          <b>{{ product.title }}</b> werd toegevoegd aan je mandje.<br>
          <br>
          Wil je nog verder winkelen? Of gaan we verder naar het mandje?
  
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="next=false" to="/shop">Verder shoppen</v-btn>
          <v-btn color="secondary" flat @click="next=false" to="/basket">Naar het mandje!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
  </v-card>
</div>
`,
  computed: {
    html_description: function() {
      return this.product.description.replaceAll("\n", "<br>\n");
    },
    html_intro: function() {
      return this.product.intro.replaceAll("\n", "<br>\n");
    },
    is_error: function() {
      return this.product && "readyState" in this.product && "status" in this.product;
    },
    have_options : function() {
      return this.product.options && this.product.options.length > 0;
    },
    page_layout: function() {
      return this.layout == "page";
    },
    card_layout: function() {
      return this.layout == "card";
    },
    link_to: function() {
      return this.nolink ? null : "/products/" + this.product.id;
    },
    header : function() {
      return {
        height: this.page_layout ? 300 : 150,
        images: this.product.images,
        card: { image: this.product.images[0].replace(/.jpeg$/,".header.jpeg") }
      }
    },
    info_flex: function() {
      return this.page_layout ? { md9: true, xs12 : true, "mb-4" : true } : { xs12: true };
    }
  },
  methods: {
    show: function(product) {
      router.push("/products/" + product.id);
    },
    show_image: function(index) {
      var self = this;
      var items = this.header.images.map(function(image){
        return { src : self.cdn(image) }
      });
      $.magnificPopup.open({
        items: items,
        tClose: 'Sluit (Esc)',
        tLoading: "Afbeelding wordt geladen...",
        image: { tError: 'De afbeelding kon niet geladen worden.' },
        ajax:  { tError: 'De afbeelding kon niet geladen worden.' },
        gallery: {
          enabled: items.length > 1,
          navigateByImgClick: true,
          preload: [0,1],
          arrowMarkup: '<i aria-hidden="true" class="v-icon material-icons theme--dark mfp-arrow-%dir%" style="position:absolute;opacity:0.65;margin: 0;top:50%;margin-top:-55px;padding:15px;font-size:46px;">chevron_%dir%</i>',
          tPrev: 'Vorige (linker pijltoets)',
          tNext: 'Volgende (rechter pijltoets))',
          tCounter: '%curr% / %total%'
        },
        type: "image",
        closeOnContentClick: true,
        midClick: true,
        callbacks: {
          change: function() {
            self.showing_image = this.index;
          }
        }
      });
      $.magnificPopup.instance.goTo(index);
    },
    show_configurator: function() {
      this.options_dialog = true;
    },
    add: function(options) {
      if( !options ) { options = [] }
      store.commit("add_to_basket", { "product" : this.product, "options" : options });
      this.options_dialog = false;
      this.next = true;
    }
  },
  data: function() {
    return  {
      showing_image: 0,
      options_dialog: false,
      next: false
    }
  }
});
