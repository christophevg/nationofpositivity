var OrderAdmin = {
  template : `
<Page>
  <h1>Admin Orders</h1>
    <CollectionView topic="orders" :headers="headers" resource="/api/admin/orders"
                    id="id" :selected="model.selected" @select="select"
                    actions="delete show|blue|receipt"
                    sortBy="created"
                    :enrich="add_status"
                    :labels="model.labels"
                    @show="show">

      <v-tabs v-model="model.active">
        <v-tab key="overview">Order</v-tab>
        <v-tab key="payment">Payment</v-tab>
        <v-tab key="shipping">Shipping</v-tab>
        <v-tab key="contact">Contact</v-tab>
        <v-tab key="raw">Raw</v-tab>

        <v-tab-item key="overview">
          <OrderOverview :order="model.selected" with-extras/>
        </v-tab-item>

        <v-tab-item key="payment">

          <div v-if="model.selected.paid_at != ''">Order was paid on {{ model.selected.paid_at }}.</div>
          <div v-else>
            Order isn't paid yet.<br>
            <v-btn @click="paid">Mark as paid</v-btn>
          </div>

        </v-tab-item>

        <v-tab-item key="shipping">

          <div v-if="model.selected.shipped_at != ''">
            Order was shipped on {{ model.selected.shipped_at }}.<br>
            <a :href="model.selected.shipment" target="_blank">{{ model.selected.shipment }}</a>
          </div>
          <div v-else>
            Order isn't shipped yet.<br>
            <v-text-field label="Tracker URL" v-model="model.tracker"></v-text-field>
            <v-btn v-if="model.tracker !=''" @click="track">Track</v-btn><br>
            <v-btn @click="shipped">Mark as shipped</v-btn>
          </div>

          <div v-if="model.selected.delivered_at != ''">Order was delivered on {{ model.selected.delivered_at }}.</div>
          <div v-else>
            Order isn't delivered yet.<br>
            <v-btn @click="delivered">Mark as delivered</v-btn>
          </div>

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
    add_status: function(orders) {
      return orders.map(function(order) {
        if(order["delivered_at"]) {
          order["status"] = "delivered";
        } else if(order["shipped_at"]) {
          order["status"] = "shipped";          
        } else if(order["paid_at"]) {
          order["status"] = "in production";
        } else {
          order["status"] = "awaiting payment";
        }
        return order;
      });
    },
    select : function(selected) {
      this.model.selected = selected;
      this.model.tracker = "";
    },
    paid: function() {
      var now  = moment().format(),
          self = this;
      patch(
        "/api/admin/orders/" + this.model.selected.id,
        { "paid_at": now },
        function(response) {
          self.model.selected.paid_at = now;
        },
        function(response) {
          console_warn(response);
        }
      );
    },
    shipped: function() {
      var now  = moment().format(),
          self = this;
      patch(
        "/api/admin/orders/" + this.model.selected.id,
        { "shipped_at": now, "shipment" : this.model.tracker },
        function(response) {
          self.model.selected.shipped_at = now;
          self.model.selected.shipment = self.model.tracker;
          this.model.tracker = "";
        },
        function(response) {
          console_warn(response);
        }
      );
    },
    delivered: function() {
      var now  = moment().format(),
          self = this;
      patch(
        "/api/admin/orders/" + this.model.selected.id,
        { "delivered_at": now },
        function(response) {
          self.model.selected.delivered_at = now;
        },
        function(response) {
          console_warn(response);
        }
      );
    },
    track: function() {
      if(this.model.tracker != "") {
        window.open(this.model.tracker, "_blank");
      }
    },
    show: function(id) {
      window.open("/order/" + id, "_blank");
    }
  },
  data: function() {
    return {
      model: {
        selected: {},
        active: null,
        tracker: "",
        labels: {
          "delete it"     : "Ben je zeker",
          "delete item"   : "Wil je volgend item zeker verwijderen:",
          "confirm delete": "Ja",
          "cancel delete" : "Neen"
        }
      },
      headers: [
        { text: "status",  align: "left",  sortable: false, value: "status"       },
        { text: "id",      align: "left",  sortable: true,  value: "id"           },
        { text: "buyer",   align: "left",  sortable: true,  value: "contact.name" },
        { text: "total",   align: "right", sortable: true,  value: "total.grand"  },
        { text: "created", align: "left",  sortable: true,  value: "created"      },
        { text: "status",  align: "left",  sortable: true,  value: "status"       }
      ],
    }
  }
};

Navigation.add(OrderAdmin);
