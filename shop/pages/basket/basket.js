var Basket = {
  template : `
<Page>

  <h1>Jouw positief mandje</h1>
  
  <p>
  
    Nog enkele stappen en jouw geluk is onderweg...
  
  </p>
  
  <v-stepper v-model="stage" vertical>

    <!-- step 1: basket -->
  
    <v-stepper-step :complete="stage > 1" step="1" editable>

      Jouw selectie

     <small>

       Dit zijn de artikels die je toegevoegd hebt aan je selectie. Je kan ze
       hier nog bewerken en/of kijk verder in de shop om nog leuke dingen toe
       te voegen.

      </small>

    </v-stepper-step>

    <v-stepper-content step="1">
      <OrderOverview :order="basket" editable @on_add="add" @on_remove="remove"/>

      <div class="text-xs-center mt-2">
        <v-btn :disabled="!this.basket_ok" color="primary" @click="stage = 2">Ja, dat wil ik...</v-btn>
      </div>
    </v-stepper-content>

    <!-- step 2: contact info -->

    <v-stepper-step :complete="stage > 2" step="2" :editable="stage >= 2">

      Jouw gegevens

      <small>
        
        Vervolledig onderstaande gegevens, zodat we je kunnen bereiken en
        vooral om je weldra jouw happiness te kunnen opsturen. Je gegevens
        worden bewaard op deze computer, zodat je ze volgende keer niet meer
        opnieuw moet invullen.
  
      </small>

    </v-stepper-step>
  
    <v-stepper-content step="2">

      <ContactCard :contact="contact" @on_update="on_update"/>

      <div class="text-xs-center mt-2">
        <v-btn color="primary" :disabled="!contact_ok" @click="stage = 3">Prima, dat ben ik...</v-btn>
      </div>
    </v-stepper-content>
    

    <!-- step 3: shipping -->

    <v-stepper-step :complete="stage > 3" step="3" :editable="stage >= 3">

      Verzending

      <small>
        
        Na wat puzzelen krijgen we alles zo goed mogelijk kunnen verpakken voor
        je en kunnen we het verzenden zoals hieronder beschreven.
  
      </small>

    </v-stepper-step>

    <v-stepper-content step="3">

      <p>We werken met GLS om je order in perfecte omstandigheden tot bij jou
      te brengen.</p>
  
      <p>Voor jouw zending gebruiken we het {{ shipping_format }}
      pakket-formaat. Dit kost &euro; {{ shipping_total.toFixed(2) }}</p>

      <div class="text-xs-center mt-2">
        <v-btn color="primary" @click="stage = 4">Ok, zo mag dat naar mij komen...</v-btn>
      </div>
    </v-stepper-content>

    <!-- step 4: payment -->

    <v-stepper-step :complete="stage > 4" step="4" :editable="stage >= 4">

      Betaling

      <small>
        
        Kies hoe je dit graag wil betalen.
  
      </small>

    </v-stepper-step>

    <v-stepper-content step="4">

      <v-switch v-model="payment" :label="payment ? 'online' : 'overschrijving'"></v-switch>

      <p v-if="payment">

        Je wordt na bevestiging doorgestuurd naar onze betaalpartner Mollie. Je
        betaalt een online transactiekost van &euro; {{ payment_total }}<br>

      </p>

      <p v-if="!payment">

        Je betaalt per overschrijving. Betaalinstructies vind je terug in de
        bevestigingsmail die je ontvangt na bevestiging van je order.

      </p>
  
      <div class="text-xs-center mt-2">
        <v-btn color="primary" @click="stage = 5">Top, zo betaal ik dat!</v-btn>
      </div>
    </v-stepper-content>

    <!-- step 5: summary / confirmation -->

    <v-stepper-step :complete="stage > 5" step="5">

      Jouw bevestiging

      <small>
  
        Nog een laatste controle en dan gaan we aan de slag voor jou.
        Controleer je keuze, je gegevens en de extra's' nog een laatste keer.
        Als je bevestigt wordt je order aangemaakt. Vanaf dit moment koop je
        met betaalverplichting.
  
      </small>

    </v-stepper-step>

    <v-stepper-content step="5">
      
      <OrderOverview :order="basket" with-extras/>

      <div class="text-xs-center">
        <v-checkbox
          v-model="confirmation"
          value="1"
          type="checkbox"
        >
       <template v-slot:label>
      <div>
      Ja, ik begrijp dat ik door deze bevestiging een betaalverplichting heb en dat ik akkoord ga met de <router-link to="/algemene-voorwaarden">algemene verkoopsvoorwaarden</router-link> en me houd aan een acceptable manier van gebruik van deze website (zie ook 'Mag ik doen en laten wat ik wil?' bij <router-link to=\"/faq\">vraag &amp; antwoord</router-link>)
      </div>
      </template>
      </v-checkbox>
        <v-btn :disabled="!confirmation" color="primary" @click="submit">Ja, zo is alles goed...</v-btn>
      </div>
    </v-stepper-content>

  </v-stepper>
  <v-dialog v-model="submission_overlay" persistent width="300">
    <v-card>
      <v-card-text>

        <br>
        We registreren je order.<br>
        <span v-if="payment">
        <br>
        Nadien wordt je doorverwezen naar de betaalpartner, Mollie.
        </span>
        <br><br>

        <v-progress-linear indeterminate color="primary" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
        
  <br>
</Page>
`,
  navigation: {
    section: null,
    icon:    "shopping_cart",
    text:    "Jouw positief mandje",
    path:    "/basket",
    index:   3
  },
  mounted: function() {
    store.dispatch("refresh_basket");
  },
  computed: {
    basket: function() {
      return store.getters.order;
    },
    basket_ok: function() {
      return this.basket.lines.length > 0;
    },
    contact: function() {
      return store.state.contact;
    },
    contact_ok: function() {
      // store must always be valid, form also to be taken into account when
      // at least validated once
      if(this.contact_form_is_validated) {
        return this.contact_form_is_valid && store.getters.contact_is_valid;
      }
      return store.getters.contact_is_valid;
    },
    shipping_format: function() {
      return store.getters.shipping_format;
    },
    shipping_total: function() {
      return store.getters.shipping_total;
    },
    payment_total: function() {
      return store.getters.payment_total;
    },
    payment: {
      get() {
        return store.getters.payment_total > 0;
      },
      set(value) {
        store.commit("update_payment", value)
      }
    }
  },
  methods: {
    remove: function(line) {
      store.commit("remove_from_basket", line);
    },
    add: function(line) {
      store.commit("add_to_basket", line);      
    },
    on_update: function(result) {
      if(result.is_valid) {
        store.commit("contact", result.contact);
      }
      this.contact_form_is_valid = result.is_valid;
      this.contact_form_is_validated = true;
    },
    submit: function() {
      if(typeof grecaptcha === "undefined" || (!grecaptcha) ) {
        app.$notify({
          group: "notifications",
          title: "Whoops...",
          text:  "Daar ging iets mis :-(<br><br>\nWe kunnen het internet blijkbaar niet bereiken. Probeer het eens opnieuw en/of ververs je browser even.",
          type:  "error",
          duration: 10000
        });
        return;
      }
      this.submission_overlay = true;
      var self = this;
      grecaptcha.ready(function() {
        grecaptcha.execute(store.state.config.recaptcha, {action: "submit"}).then(function(token) {
          post( "/api/orders",
            {
              order    : self.basket,
              contact  : self.contact,
              payment  : self.payment,
              recaptcha: token
            },
            function( data ) {
              // server responded successfully, so order is registered
              // clear basket and proceed to the next page
              // in case provided in response go there, else go to order page
              store.commit("clear_basket");
              self.submission_overlay = false;
              if( data.next ) {
                window.location = data.next;
              } else {
                router.push("/order/" + data.id);
              }
            },
            function( response ) {
              // something went wrong, ensure a fresh basket and start over with
              // product/price confirmation.
              store.dispatch("refresh_basket");
              self.submission_overlay = false;
              self.confirmation = false;
              self.stage = 1;
            }
          );
        })
      })
    }
  },
  data () {
    return {
      stage: 1,
      submission_overlay: false,
      confirmation: false,
      contact_form_is_validated: false,
      contact_form_is_valid: false,
    }
  }
};

Navigation.add(Basket);

Vue.set(Basket.navigation, "badge", store.state.basket.badge);
