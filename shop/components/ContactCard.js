Vue.component("ContactCard", {
  props: [ "contact" ],
  template: `
    <v-card>
      <v-card-text>
        <vue-form-generator :schema="schema" :model="model" :options="formOptions"
                            @validated="onValidated"
        ></vue-form-generator>
      </v-card-text>
    </v-card>  
`,
  created: function() {
    // TODO: look into this because beforeMounted is not run synchronously
    if("name" in this.contact) {
      this.import_contact();
    } else {
      var self = this;
      store.subscribe( function(mutation, state) {
        if( mutation.type === "initialise_contact" ) {
          self.import_contact();
        }
      });
    }
  },
  methods: {
    import_contact: function() {
      var self = this;
      this.schema.fields.forEach(function(field){
        if(field.model in self.contact) {
          Vue.set(self.model, field.model, self.contact[field.model]);
        }
      });
    },
    onValidated: function(is_valid, errors) {
      this.$emit("on_update", { contact : this.model, is_valid: is_valid } );
    }
  },
  data: function() {
    return {
      model: {},
      schema: { fields: store.getters.contact_schema },
      formOptions: {
        validateAfterLoad:    false,
        validateAfterChanged: true
      }
    }
  }
});
