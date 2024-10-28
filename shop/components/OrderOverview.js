Vue.component("OrderOverview", {
  props: {
    "order"      : Object,
    "editable"   : Boolean,
    "withExtras" : Boolean
  },
  template: `
<div>
  <OrderOverviewAsDataTable class="hidden-xs-only"   :order="order" :editable="editable" :with-extras="withExtras" @on_add="add" @on_remove="remove"/>
  <OrderOverviewAsList      class="hidden-sm-and-up" :order="order" :editable="editable" :with-extras="withExtras" @on_add="add" @on_remove="remove"/>
</div>
`,
  methods: {
    add: function(item) {
      this.$emit("on_add", item);
    },
    remove: function(item) {
      this.$emit("on_remove", item);
    }
  }
});

Vue.component("OrderOverviewAsList", {
  props: {
    "order"      : Object,
    "editable"   : Boolean,
    "withExtras" : Boolean
  },
  template: `
<v-card>
  <v-list two-line subheader>
    <v-subheader>Producten</v-subheader>

    <v-list-tile v-for="(item, i) in order.lines" :key="i">
      <v-list-tile-content>

        <v-list-tile-title>
          <router-link :to="'/products/' + item.product.id">{{ item.product.title }}</router-link>
        </v-list-tile-title>

        <v-list-tile-sub-title>
          {{ summary(item.options )}}<br>
          &euro; {{ item.unit_price | fixed2 }} x {{ item.amount }} = &euro; {{ item.line_total | fixed2  }}
        </v-list-tile-sub-title>

      </v-list-tile-content>

        <v-list-tile-action>
          <div>
          <v-icon v-if="editable" small class="mr-2" @click="remove(item)">remove</v-icon>
          <v-icon v-if="editable" small class="mr-2" @click="add(item)">add</v-icon>
          </div>
        </v-list-tile-action>

    </v-list-tile>

  </v-list>

  <v-divider></v-divider>
          
  <div style="margin-bottom: 20px">
    <v-subheader>Totaal</v-subheader>
    
    <table width="100%" cellspacing=0 cellpadding="0" border="0">
      <tr>
        <th class="text-xs-right">Artikels</th><td class="text-xs-right">&euro;{{ order.total.lines | fixed2 }}</td>
      </tr>
      <tr class="text-xs-right" v-if="withExtras">
        <th>Verzending</th><td class="text-xs-right">&euro; {{ order.total.shipping | fixed2 }}</td>
      </tr>
      <tr class="text-xs-right" v-if="withExtras && order.total.payment > 0">
        <th>Online betalen</th><td class="text-xs-right">&euro; {{ order.total.payment | fixed2 }}</td>
      </tr>
      <tr class="text-xs-right" v-if="withExtras">
        <th>Totaal</th><td class="text-xs-right">&euro; {{ order.total.grand | fixed2 }}</td>
      </tr>
      <tr class="text-xs-right" v-if="withExtras">
        <th>Waarvan 21% BTW</th><td class="text-xs-right">&euro; {{ order.total.tax | fixed2 }}</td>
      </tr>
    </table>
  </div>

</v-card>
`,
  computed: {
    summary: function() {
      return function(options) {
        return options.map(function(option) {
          return option.option + " : " + option.choice.substring(0,30) + ( option.choice.length > 30 ? "..." : "") + (
            option.cost > 0 ? " (+€" + option.cost + ")" : "" 
          );
        }).join(", ");
      }
    }
  },
  methods: {
    add: function(item) {
      this.$emit("on_add", item);
    },
    remove: function(item) {
      this.$emit("on_remove", item);
    }
  }
});

Vue.component("OrderOverviewAsDataTable", {
  props: {
    "order"      : Object,
    "editable"   : Boolean,
    "withExtras" : Boolean
  },
  template: `
<v-data-table
  :headers="headers"
  :items="order.lines"
  class="elevation-1"
  hide-actions
>
  <template v-slot:no-data>

      Je hebt nog geen spulletjes toegevoegd aan je order. Ontdek positiviteit
      <router-link to="/shop">in de shop</router-link>...

  </template>

  <template v-slot:items="line">
    <td>
      <router-link :to="'/products/' + line.item.product.id">{{ line.item.product.title }}</router-link>
      <div class="grey--text">{{ summary(line.item.options )}}</div>
    </td>
    <td class="text-xs-right">{{ line.item.amount }}</td>
    <td class="left layout px-0" width="1%">
      <v-icon v-if="editable" small class="mr-2" @click="remove(line.item)">remove</v-icon>
      <v-icon v-if="editable" small class="mr-2" @click="add(line.item)">add</v-icon>
    </td>
    <td class="text-xs-right">&euro; {{ line.item.unit_price | fixed2 }}</td>
    <td class="text-xs-right">&euro; {{ line.item.line_total | fixed2  }}</td>
  </template>
  <template v-slot:footer>
    <tr>
      <td :colspan="headers.length" class="text-xs-right">
        <b>Artikels: &euro; {{ order.total.lines | fixed2 }}</b>
      </td>
    </tr>
    <tr v-if="withExtras">
      <td :colspan="headers.length" class="text-xs-right">
        <b>Verzending: &euro; {{ order.total.shipping | fixed2 }}</b>
      </td>
    </tr>
    <tr v-if="withExtras && order.total.payment > 0">
      <td :colspan="headers.length" class="text-xs-right">
        <b>Online Payment: &euro; {{ order.total.payment }}</b>
      </td>
    </tr>
    <tr v-if="withExtras">
      <td :colspan="headers.length" class="text-xs-right">
        <b>Totaal: &euro; {{ order.total.grand | fixed2 }}</b>
      </td>
    </tr>
    <tr v-if="withExtras">
      <td :colspan="headers.length" class="text-xs-right">
        Waarvan 21% BTW: &euro; {{ order.total.tax | fixed2 }}
      </td>
    </tr>
  </template>
</v-data-table>
`,
  computed: {
    summary: function() {
      return function(options) {
        return options.map(function(option) {
          return option.option + " : " + option.choice.substring(0,30) + ( option.choice.length > 30 ? "..." : "") + (
            option.cost > 0 ? " (+€" + option.cost + ")" : "" 
          );
        }).join(", ");
      }
    }
  },
  methods: {
    add: function(item) {
      this.$emit("on_add", item);
    },
    remove: function(item) {
      this.$emit("on_remove", item);
    }
  },
  data: function() {
    return {
      headers: [
        { text: "Product", align: "left",  sortable: true,  value: "product.title" },
        { text: "Aantal",  align: "right", sortable: true,  value: "amount"        },
        { text: "",        align: "left",  sortable: false, value: "actions"       },
        { text: "Prijs",   align: "right", sortable: true,  value: "unit_price"     },
        { text: "Totaal",  align: "right", sortable: true,  value: "line_total"     }
      ]
    }
  } 
});
