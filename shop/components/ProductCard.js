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
      <vue-form-generator :schema="model.schema" :model="model.options" :options="formOptions"
                          @validated="onValidated"/>
          
      <h3 class="subheading mt-3 grey--text">Bijkomende kosten voor verzending : &euro; {{ shipping_price | fixed2 }}</h3>
    
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
  mounted: function() {
    // generate schema for product
    this.model.schema = {
      fields: !this.product.options ?
        []
        :
        this.product.options.map(function(field) {
          if(field.validate) {
            field.validator = VueFormGenerator.validators[field.validate].locale(nl);
          }
          return field;
        })
    };
  },
  computed: {
    have_options: function() {
      return this.product.options && this.product.options.length > 0;
    },
    selected_options: function() {
      var self = this;
      return Object.keys(this.model.options).map(function(id){
        if(self.model.options[id] == null) { return null; }
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
    shipping_price: function() {
      return "4.99";
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
        schema: null,
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
  <v-card :to="link_to" tile height="100%" style="margin-right: 3px;">

    <div v-if="! product">
      Ok, dit product wordt geladen...
    </div>
  
    <div v-if="is_error">
      Whoops, dat product lijkt niet te bestaan...
    </div>

    <div v-if="product && ! is_error">
  
      <v-img v-if="(card_layout && header.images.length >= 1) || (page_layout && header.images.length == 1)"
             :src="cdn(header.images[0])"
             :aspect-ratio="header.ratio"
             @click.native="show_image(header.images[0])"
             style="text-align:right;">
        <v-btn flat icon color="white" v-on:click.prevent @click="show_image(header.images[0])">
          <v-icon>expand</v-icon>
        </v-btn>
      </v-img>

      <v-carousel :height="header.height" v-if="page_layout && header.images.length >= 2" hide-delimiters :cycle="false">
        <v-carousel-item v-for="(item,i) in header.images" :key="i" :src="cdn(item)" @click.native="show_image(item)"/>
      </v-carousel>

      <v-dialog v-model="image_viewer">
        <v-img v-if="selected_image" :src="cdn(selected_image)" contain @click.native="image_viewer=false"
               style="text-align:right;">
          <v-btn flat icon color="white" v-on:click.prevent @click="image_viewer=false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-img>
      </v-dialog>

      <v-dialog v-if="card_layout" v-model="options_dialog" max-width="600px">
        <v-card>
          <ProductConfigurator :product="product" @add="add"/>
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
                  
    </div>
  
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
        ratio: this.page_layout ? 5 : 2,
        height: 300,
        images: this.product.images
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
    show_image: function(item) {
      this.selected_image = item;
      this.image_viewer = true;
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
      image_viewer : false,
      options_dialog: false,
      selected_image : null,
      next: false
    }
  }
});
