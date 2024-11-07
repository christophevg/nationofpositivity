var NewsAdmin = {
  mixins: [ Content ],
  template : `
<Page>
  <h1>Admin News</h1>
    <CollectionView topic="news" :headers="headers" resource="/api/admin/news"
                    id="id" :selected="model.selected" @select="select"
                    sortBy="title"
                    :schema="schema" :formOptions="formOptions"
                    actions="create delete"
                    :created="model.create" @create="create">
      <v-tabs v-model="model.active">
        <v-tab key="form">Item</v-tab>
        <v-tab key="preview">Preview</v-tab>
        <v-tab key="raw">Raw</v-tab>

        <v-tab-item key="form">
          <vue-form-generator :schema="schema" :model="model.selected" :options="formOptions"/>
          <v-btn @click="submit()" class="primary">update</v-btn>
        </v-tab-item>

        <v-tab-item key="preview">
          <v-layout justify-center row fill-height>
            <v-flex xs12 sm6 md8>
              <NewsItem :item="model.selected"/>
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
  navigation: {
    section: "Admin",
    icon:    "info",
    text:    "News",
    path:    "/admin/news"
  },
  methods: {
    select : function(selected) {
      this.model.selected = selected;
    },
    create: function() {
      var self = this;
      post(
        "/api/admin/news",
        this.model.create,
        function(response) {
          self.model.create = {
            when: moment().toISOString()
          };
          self.$router.go(0);
        },
        function(response) {
          console_warn(response);
        }        
      );
    },
    submit: function() {
      put(
        "/api/admin/news/" + this.model.selected.id,
        this.model.selected,
        function(response) {},
        function(response) {
          console_warn(response);
        }
      );
    }
  },
  data: function() {
    return {
      model: {
        selected: {},
        create  : {
          when: moment().toISOString()
        },
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
            type       : "input",
            inputType  : "text",
            label      : "when",
            model      : "when",
            
          },
          {
            type       : "input",
            inputType  : "text",
            label      : "Title",
            model      : "title"
          },
          {
            type       : "textArea",
            label      : "Body",
            model      : "body",
            rows       : 10
          },
          {
             type: "vueMultiSelect",    
             model: "image",
             label: "Image",
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
        { text: "id",    align: "left",  sortable: false, value: "id"    },
        { text: "title", align: "left",  sortable: false, value: "title" },
        { text: "when",  align: "left",  sortable: false, value: "when"  }
      ],
    }
  }
};

Navigation.add(NewsAdmin);
