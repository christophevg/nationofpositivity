var CollectionAdmin = {
  template : `
<Page>
  <h1>Admin Collections</h1>
    <CollectionView topic="collections" :headers="headers" resource="/api/admin/collections"
                    id="id" :selected="model.selected" @select="select"
                    sortBy="title"
                    :schema="schema" :formOptions="formOptions"
                    actions="create delete"
                    :created="model.create" @create="create">
      <v-tabs v-model="model.active">
        <v-tab key="form">Collection</v-tab>
        <v-tab key="raw">Raw</v-tab>

        <v-tab-item key="form">
          <vue-form-generator :schema="schema" :model="model.selected" :options="formOptions"/>
          <v-btn @click="submit()" class="primary">update</v-btn>
        </v-tab-item>

        <v-tab-item key="raw">
          <div style="margin:20px" v-html="$options.filters.syntaxHighlight(model.selected, 400)"></div>
        </v-tab-item>
      </v-tabs>
    </CollectionView>
</Page>
`,
  navigation: {
    section: "Admin",
    icon:    "category",
    text:    "Collections",
    path:    "/admin/collections"
  },
  methods: {
    select : function(selected) {
      this.model.selected = selected;
    },
    create: function() {
      var self = this;
      post(
        "/api/admin/collections",
        this.model.create,
        function(response) {
          self.model.create = {};
          self.$router.go(0);
        },
        function(response) {
          console_warn(response);
        }
      );
    },
    submit: function() {
      put(
        "/api/admin/collections/" + this.model.selected.id,
        this.model.selected,
        function(response) {
        },
        function(response) {
          console_warn(response);
        }
      );
    }
  },
  data: function() {
    return {
      model: {
        images : {},
        selected: {},
        create  : {} ,
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
            type       : "checkbox",
            label      : "Highlight",
            model      : "highlight"
          },
          {
             type: "vueMultiSelect",
             model: "highlight_image",
             label: "Highlight Image",
             placeholder: "",
             required: false,
             selectOptions: {
               allowEmpty: false,
               multiple: false,
               searchable: true,
               taggable: true,
               tagPlaceholder: "voeg toe...",
               onNewTag: function(newTag, id, options, value){
                 value.push(newTag);
               }
             },
             values: store.getters.images()
           }
        ]
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true
      },
      headers: [
        { text: "id",         align: "left",  sortable: true, value: "id"         },
        { text: "title",      align: "left",  sortable: true, value: "title"      }
      ],
    }
  }
};

Navigation.add(CollectionAdmin);
