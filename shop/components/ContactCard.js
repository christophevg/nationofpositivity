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
  watch: {
    contact: {
      immediate: true,
      handler: function(_) {
        if(! this.contact || ! "name" in this.contact) { return; }
        // import newContact in local model
        var self = this;
        this.schema.fields.forEach(function(field){
          if(field.model in self.contact) {
            Vue.set(self.model, field.model, self.contact[field.model]);
          }
        });
      }
    }
  },
  methods: {
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
