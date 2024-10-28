var contact_schema = [
  {
    type       : "input",
    inputType  : "text",
    label      : "Naam",
    placeholder: "Voornaam en naam",
    model      : "name",
    required   : true,
    min        : 3,
    validator  : VueFormGenerator.validators.string.locale(nl) 
  },
  {
    type       : "input",
    inputType  : "text",
    label      : "Adres",
    placeholder: "Straatnaam, huisnummer en toevoeging",
    model      : "address",
    required   : true,
    min        : 3,
    validator  : VueFormGenerator.validators.string.locale(nl)
  },
  {
    type       : "input",
    inputType  : "number",
    label      : "Postcode",
    placeholder: "",
    model      : "postalcode",
    required   : true,
    styleClasses:'flex xs12 md3',
    min        : 1000,
    validator  : VueFormGenerator.validators.integer.locale(nl)
  },
  {
    type       : "input",
    inputType  : "text",
    label      : "Plaats",
    placeholder: "",
    model      : "city",
    required   : true,
    min        : 3,
    validator  : VueFormGenerator.validators.string.locale(nl),
    styleClasses:'flex xs12 md8 offset-md1'
  },
  {
    type       : "input",
    inputType  : "text",
    label      : "Telefoonnummer",
    placeholder: "Vast of mobiel",
    model      : "phone",
    required   : true,
    min        : 3,
    validator  : VueFormGenerator.validators.string.locale(nl)
  },
  {
    type       : "input",
    inputType  : "text",
    label      : "E-mail",
    placeholder: "",
    model      : "email",
    required   : true,
    min        : 3,
    validator  : VueFormGenerator.validators.email.locale(nl)
  },
  {
    type       : "input",
    inputType  : "text",
    label      : "Bedrijfsnaam",
    placeholder: "",
    model      : "company"
  },
  {
    type       : "input",
    inputType  : "text",
    label      : "BTW nummer",
    placeholder: "",
    model      : "tax"
  }
];

store.registerModule("contact", {
  state: {},
  getters: {
    contact_schema: function() {
      return contact_schema;
    },
    contact_is_valid: function(state) {
      var final_report = contact_schema.reduce(function(report, field) {
        if( field.validator ) {
          var errors = field.validator(state[field.model], field );
          if( errors && errors.length > 0 ) {
            report[field.model] = errors;
          }
        }
        return report;
      }, {});
      var is_valid = Object.keys(final_report).length == 0;
      if(! is_valid ) {
        console_warn("contact in store is not valid", final_report);
      }
      return is_valid;
    }
  },
  mutations: {
    initialise_contact: function(state) {
			if(localStorage.getItem("contact")) {
        var contact = JSON.parse(localStorage.getItem("contact"));
        contact_schema.forEach(function(field){
          if( field.model in contact ) {
            Vue.set(state, field.model, contact[field.model]);
          }
        });
		  }
    },
    contact: function(state, contact) {
      contact_schema.forEach(function(field){
        if( field.model in contact ) {
          Vue.set(state, field.model, contact[field.model]);
        }
      });
    }
  }
});

// cache basket in localstorage

store.subscribe((mutation, state) => {
  if([ "contact" ].includes(mutation.type)) {
    localStorage.setItem("contact", JSON.stringify(state.contact));
  }
});

before_app_mount( function() { store.commit("initialise_contact"); } );
