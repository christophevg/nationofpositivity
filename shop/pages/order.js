var Order = {
  template : `
<Page>
  <div v-if="order.created">
    <h1>Jouw order van {{ order.created | formatDateTime }}</h1>

    <p>

      Nogmaals bedankt voor je order!<br>
  
      Hieronder vind je een overzicht van je bestelling, als ook een overzicht
      van de stappen die jouw stukje positiviteit tot bij jou brengen.
  
    </p>

    <OrderOverview :order="order" with-extras/>
      
    <div>

      <div class="mt-2 mb-2"><h2>Voortgang</h2></div>
  
      <!-- VERTICAL -->
  
      <v-stepper :value="step" vertical v-show="$vuetify.breakpoint.smAndDown">

         <template v-for="(step_config, n) in steps">
            <v-stepper-step :step="n + 1"
                            :key="n +'-step-vertical'"
                            :complete="step-1 >= n"
                            :complete-icon="step_config['completeIcon']"
                            :color="step_config['color']"
            >{{ step_config.title }}</v-stepper-step>

            <v-stepper-content :key="n +'-info-vertical'" :step="n+1">
              <div v-html="step_config.info"/>
              <div v-if="step_config['dynamic']" v-html="dynamic(step_config['dynamic'])"/>
            </v-stepper-content>
          </template>

      </v-stepper>
  
      <!-- HORIZONTAL -->

      <v-stepper :value="step" v-show="$vuetify.breakpoint.mdAndUp">

        <v-stepper-header>
            
         <template v-for="(step_config, n) in steps">
            <v-stepper-step :step="n + 1"
                            :key="n +'-step'"
                            :complete="step-1 >= n"
                            :complete-icon="step_config['completeIcon']"
                            :color="step_config['color']"
            >{{ step_config.title }}</v-stepper-step>

            <v-divider v-if="n < steps.length-1" :key="n"/>
          </template>

        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content v-for="(step_config, n) in steps" :key="n +'-info'" :step="n+1">
            <div v-html="step_config.info"/>
            <div v-if="step_config['dynamic']" v-html="dynamic(step_config['dynamic'])"/>
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
      
  <br>
</Page>
`,
  created: function() {
    var self = this;
    $.get({
      url: "/api/orders/" + this.$route.params.id,
      success: function(response) {
        self.order = response;
        if(self.order.paid_at !="")      { self.step = 2; }
        if(self.order.shipped_at !="")   { self.step = 3; }
        if(self.order.delivered_at !="") { self.step = 4; }
      },
      error: function(response) {
        self.order = response;
      }
    });
  },
  computed: {
    dynamic: function() {
      return function(item) {
        if(item == "tracking" && this.order.shipment !="") {
          return `Je kan deze zending volgen
        op <a href="${this.order.shipment}" target="_blank">de track &amp;
        trace pagina van de transportdienst</a>.</span>`;
        }
        return "";
      }
    }
  },
  data: function() {
    return {
      step  : 1,
      order : {},
      steps : [
        {
          title: "Jouw betaling",
          info: `
            We wachten nog even op bevestiging van je betaling en beginnen dan
            snel aan jouw stukje positiviteit te werken!<br>
  
            Als je ons nog extra informatie of afbeeldingen moet bezorgen, kan
            je dit doen door te antwoorden op de bevestigingsmail die je van
            ons ontving.
`
        },
        {
          title: "Ontwerp & Realisatie",
          info: `
            We hebben jouw betaling goed ontvangen! Bedankt.<br>
  
            Als je ons nog extra informatie of afbeeldingen moet bezorgen, kan
            je dit doen door te antwoorden op de bevestigingsmail die je van
            ons ontving.

            Als we alle informatie hebben starten we aan de realisatie van jouw
            stukje positiviteit. Indien van toepassing, maken we eerst een
            volledig ontwerp van de personalisatie en sturen je dit op. Na jouw
            bevestiging starten we dan echt aan de realisatie.
`
        },
        {
          title: "Verzending",
          info: `
          Hoera, jouw positiviteit is verzonden en komt jouw kant op.<br>    
`,
          dynamic: "tracking"
        },
        {
          title: "Jouw Positivity is er!",
          info: `
            We hebben bericht ontvangen van de transportdienst dat het bij jou
            is toegekomen.<br>
            
            Veel plezier met jouw stukje positiviteit! ❤️<br>
            
            Laat ons weten wat je er van vindt! Een foto met tag op sociale
            media appreciëren we ten zeerste!            
`,
          completeIcon: "favorite",
          color: "success"
        }
      ]
    }
  }
};

router.addRoutes([ { path: "/order/:id", component: Order } ]);
