var OrderAdmin = {
  template : `
<Page>
  <h1>Admin Orders</h1>
    <CollectionView topic="orders" :headers="headers" resource="/api/admin/orders"
                    id="id" :selected="model.selected" @select="select"
                    sortBy="created">

      <v-tabs v-model="model.active">
        <v-tab key="overview">Order</v-tab>
        <v-tab key="payment">Payment</v-tab>
        <v-tab key="shipping">Shipping</v-tab>
        <v-tab key="contact">Contact</v-tab>
        <v-tab key="raw">Raw</v-tab>

        <v-tab-item key="overview">
          <OrderOverview :order="model.selected" shipping/>
        </v-tab-item>

        <v-tab-item key="payment">
          TODO
        </v-tab-item>

        <v-tab-item key="shipping">
          TODO
        </v-tab-item>

        <v-tab-item key="contact">
          <ContactCard :contact="model.selected.contact"/>
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
    icon:    "shopping_cart",
    text:    "Orders",
    path:    "/admin/orders"
  },
  methods: {
    select : function(selected) {
      this.model.selected = selected;
    }
  },
  data: function() {
    return {
      model: {
        selected: {},
        active: null
      },
      headers: [
        { text: "id",      align: "left",  sortable: true, value: "id"      },
        { text: "buyer",   align: "left",  sortable: true, value: "contact.name" },
        { text: "created", align: "left",  sortable: true, value: "created" }
      ],
    }
  }
};

Navigation.add(OrderAdmin);
