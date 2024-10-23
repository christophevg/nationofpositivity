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
      
    <div v-if="have_stages">

      <div class="mt-2 mb-2"><h2>Voortgang</h2></div>
  
      <v-stepper :value="step_index_of(stage)">

        <v-stepper-header>
          <template v-for="(step, i) in model.order.stages">
            <v-stepper-step :complete="is_completed(step)" :step="i+1">{{ step_title(step) }}</v-stepper-step>
            <v-divider></v-divider>
          </template>
          <v-stepper-step :complete="is_done" complete-icon="favorite" color="success" :step="model.order.stages.length + 1">Jouw Positivity is er!</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content :step="step_index_of('payment')">

            Ik wacht nog even op bevestiging van je betaling en begin dan
            snel aan jouw stukje positiviteit te werken!

          </v-stepper-content>

          <v-stepper-content :step="step_index_of('production')">

            Ik ben bezig om jouw stukje positiviteit zo snel mogelijk klaar te krijgen.

          </v-stepper-content>

          <v-stepper-content :step="step_index_of('shipment')">

            Hoera, jouw positiviteit is verzonden en komt jouw kant op. Je kan deze
            zending volgen via <a href="">de tracker van de courier</a>.

          </v-stepper-content>

          <v-stepper-content :step="step_index_of('pickup')">

            Hoera, jouw positiviteit ligt op jou te wachten.

          </v-stepper-content>

          <v-stepper-content :step="model.order.stages.length + 1">

            Veel plezier met jouw stukje positiviteit!

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
    have_stages: function() {
      return this.model.order.stages.length > 0;
    },
    stage: function() {
      var current = this.model.order.stages.find(function(stage){
        return ! stage.ts;
      });
      return current ? current.id : null;
    },
    step_index_of: function() {
      var self = this;
      return function(id) {
        if(id == null) { return self.model.order.stages.length + 1; }
        return self.model.order.stages.findIndex(function(stage){
          return stage.id == id;
        }) + 1;
      }
    },
    is_completed: function() {
      var self = this;
      return function(step) {
        return self.model.order.stages.find(function(stage){
          return stage.id == step.id;
        })["ts"] != null;
      }
    },
    step_title: function() {
      return function(step) {
        return {
          "payment"    : "Jouw betaling",
          "production" : "Productie",
          "shipment"   : "Verzending",
          "pickup"     : "Afhalen"
        }[step.id];
      }
    },
    is_done: function() {
      return this.model.order.stages[this.model.order.stages.length-1].ts != null;
    }
  },
  data: function() {
    return {
      model: {
        order : {
          stages : []
        }
      }
    }
  }
};

router.addRoutes([ { path: "/order/:id", component: Order } ]);
