Vue.component("ContactCard", {
  props: {
    contact : Object,
    summary : Boolean
  },
  template: `
<div>
  <p v-if="summary">
    <table cellspacing="5">
      <template v-for="(field, i) in this.schema.fields">
        <tr v-if="model[field.model] && model[field.model] != ''">
          <td><b>{{ field.label }}</b></td><td>{{ model[field.model ]}}</td>
        </tr>
      </template>
    </table>
  </p>
  <vue-form-generator v-else :schema="schema" :model="model" :options="formOptions"
                             @validated="onValidated"/>
</div>
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
