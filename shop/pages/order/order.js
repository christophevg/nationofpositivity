var Order = {
  template : `
<Page>
  <div v-if="model.order.created">
    <h1>Jouw order van {{ model.order.created | formatDateTime }}</h1>

    <p>

      Nogmaals bedankt voor je order!<br>
  
      Hieronder vind je een overzicht van je bestelling, als ook een overzicht
      van de stappen die jouw stukje positiviteit tot bij jou brengen.
  
    </p>

    <OrderOverview :order="model.order" with-extras/>
      
    <div>

      <div class="mt-2 mb-2"><h2>Voortgang</h2></div>
  
      <v-stepper :value="step">

        <v-stepper-header>
          <v-stepper-step :complete="is_paid" :step="1">Jouw betaling</v-stepper-step>
          <v-divider></v-divider>

          <v-stepper-step :complete="is_produced" :step="2">Productie</v-stepper-step>
          <v-divider></v-divider>

          <v-stepper-step :complete="is_shipped" :step="3">Verzending</v-stepper-step>
          <v-divider></v-divider>

          <v-stepper-step :complete="is_delivered" complete-icon="favorite" color="success" :step="4">Jouw Positivity is er!</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content :step="1">

            Ik wacht nog even op bevestiging van je betaling en begin dan
            snel aan jouw stukje positiviteit te werken!

          </v-stepper-content>

          <v-stepper-content :step="2">

            Ik ben bezig om jouw stukje positiviteit zo snel mogelijk klaar te krijgen.

          </v-stepper-content>

          <v-stepper-content :step="3">

            Hoera, jouw positiviteit is verzonden en komt jouw kant op.
      
            <span v-if="model.order.shipment != ''">Je kan deze zending volgen
            via <a :href="model.order.shipment" target="_blank">de tracker van de
            courier</a>.</span>

          </v-stepper-content>

          <v-stepper-content :step="4">

            Veel plezier met jouw stukje positiviteit! ❤️

          </v-stepper-content>

        </v-stepper-items>
      </v-stepper>

    </div>
  </div>
  <div v-else>
    <h1>Oei, dat order kon ik niet terugvinden :-(</h1>

    <p>

      Controleer je link nog even. Indien je je order niet terug vindt, stuur
      me dan snel een mailtje en we gaan samen op zoek.

    </p>
    
  </div>
</Page>
`,
  created: function() {
    var self = this;
    $.get({
      url: "/api/orders/" + this.$route.params.id,
      success: function(response) {
        self.model.order = response;
      },
      error: function(response) {
        self.model.order = response;
      }
    });
  },
  computed: {
    step: function() {
      if(!this.is_paid)      { return 1; }
      if(!this.is_shipped)   { return 2; }
      if(!this.is_delivered) { return 3; }
      return 4;
    },
    is_paid: function() {
      return this.model.order.paid_at != "";
    },
    is_produced: function() {
      return this.model.order.produced_at != "";
    },
    is_shipped: function() {
      return this.model.order.shipped_at != "";
    },
    is_delivered: function() {
      return this.model.order.delivered_at != "";
    }
  },
  data: function() {
    return {
      model: {
        order : {}
      }
    }
  }
};

router.addRoutes([ { path: "/order/:id", component: Order } ]);
