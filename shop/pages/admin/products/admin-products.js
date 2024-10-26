function validate_options(value, field, model) {
  try {
    var options = JSON.parse(value);
  } catch(e) {
    return [ "invalid json" ];
  }
  model.options = options;
  return []
}

function validate_specifications(value, field, model) {
  try {
    var specifications = JSON.parse(value);
  } catch(e) {
    return [ "invalid json" ];
  }
  model.specifications = specifications;
  return []
}

var ProductAdmin = {
  template : `
<Page>
  <h1>Admin Products</h1>
    <CollectionView topic="products" :headers="headers" resource="/api/admin/products"
                    id="id" :selected="model.selected" @select="select"
                    sortBy="title"
                    :schema="schema" :formOptions="formOptions"
                    actions="create delete"
                    :created="model.create" @create="create">
      <v-tabs v-model="model.active">
        <v-tab key="form">Product</v-tab>
        <v-tab key="page">Preview: Page</v-tab>
        <v-tab key="card">Preview: Card</v-tab>
        <v-tab key="raw">Raw</v-tab>

        <v-tab-item key="form">
          <vue-form-generator :schema="schema" :model="model.selected" :options="formOptions"/>
          <v-btn @click="submit()" class="primary">update</v-btn>
        </v-tab-item>

        <v-tab-item key="page">
          <ProductCard :product="model.selected" layout="page" nolink/>
        </v-tab-item>

        <v-tab-item key="card">
          <v-layout row wrap>
            <v-flex xs12 sm6 md4>
              <ProductCard :product="model.selected" layout="card" nolink/>
            </v-flex>
          </v-layout>
        </v-tab-item>

        <v-tab-item key="raw">
          <div style="margin:20px" v-html="$options.filters.syntaxHighlight(model.selected, 400)"></div>
        </v-tab-item>
      </v-tabs>
    </CollectionView>
</Page>
`,
  mounted: function() {
    this.schema.fields[7].values = store.getters.images();
  },
  navigation: {
    section: "Admin",
    icon:    "inventory",
    text:    "Products",
    path:    "/admin/products"
  },
  methods: {
    select : function(selected) {
      this.model.selected = selected;
    },
    create: function() {
      var self = this;
      post(
        "/api/admin/products",
        this.model.create,
        function(response) {
          self.model.create = {
            tags: [],
            specifications: {},
            options: [],
            unit_price: 0
          };
          console.log(response);
          self.$router.go(0);
        },
        function(response) {
          console.log(response);
        }        
      );
    },
    submit: function() {
      put(
        "/api/admin/products/" + this.model.selected.id,
        this.model.selected,
        function(response) {
          console.log(response);
        },
        function(response) {
          console.log(response);
        }
      );
    }
  },
  data: function() {
    return {
      model: {
        images : {},
        selected: {},
        create  : {
          tags: [],
          specifications: {},
          options: [],
          unit_price: 0
        } ,
        active  : null
      },
      schema: {
        fields: [
          {
            type       : "input",
            inputType  : "text",
            label      : "ID",
            model      : "id"
          },
          {
            type       : "checkbox",
            label      : "Available",
            model      : "_available"
          },
          {
            type       : "checkbox",
            label      : "Findable",
            model      : "_findable"
          },
          {
            type       : "input",
            inputType  : "text",
            label      : "Title",
            model      : "title"
          },
          {
            type       : "textArea",
            label      : "Intro",
            model      : "intro",
            max        : 200,
            rows       : 2
          },
          {
            type       : "textArea",
            label      : "Description",
            model      : "description",
            max        : 1000,
            rows       : 5
          },
          {
            type       : "textArea",
            label      : "Specifications (key/value string pairs with info)",
            model      : "specifications",
            rows       : 5,
            validator  : validate_specifications
          },
          {
             type: "vueMultiSelect",    
             model: "images",
             label: "Images",
             placeholder: "",
             required: false,  
             selectOptions: {
               allowEmpty: false,
               multiple: true,
               searchable: true,
               taggable: true,
               tagPlaceholder: "voeg toe...",
               onNewTag: function(newTag, id, options, value){
                 value.push(newTag);
               }
             },    
             values: []
           },
          {
            type: "vueMultiSelect",    
            model: "tags",
            label: "Tags",
            placeholder: "",
            required: false,  
            selectOptions: {
              allowEmpty: true,
              multiple: true,
              searchable: true,
              taggable: true,
              tagPlaceholder: "voeg toe...",
              onNewTag: function(newTag, id, options, value){
                value.push(newTag);
              }
            },    
            values: []
          },
          {
            type       : "textArea",
            label      : "Options (additional form entries)",
            model      : "options",
            rows       : 5,
            validator  : validate_options
          },
          {
            type       : "input",
            inputType  : "text",
            label      : "Price",
            model      : "unit_price"
          }
        ]
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true
      },
      headers: [
        { text: "id",         align: "left",  sortable: true, value: "id"         },
        { text: "title",      align: "left",  sortable: true, value: "title"      },
        { text: "unit_price", align: "left",  sortable: true, value: "unit_price" }
      ],
    }
  }
};

Navigation.add(ProductAdmin);
