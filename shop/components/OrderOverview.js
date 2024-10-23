Vue.component("OrderOverview", {
  props: {
    "order"    : Object,
    "editable" : Boolean,
    "shipping" : Boolean
  },
  template: `
<v-data-table
  :headers="headers"
  :items="order.lines"
  class="elevation-1"
  hide-actions
>
  <template v-slot:no-data>

      Je hebt nog geen artikels toegevoegd aan je order. Ontdek happiness
      <router-link to="/ontdek">hier</router-link>...

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
    <tr v-if="shipping">
      <td :colspan="headers.length" class="text-xs-right">
        <b>Verzending: &euro; {{ order.total.shipping | fixed2 }}</b>
      </td>
    </tr>
    <tr v-if="shipping">
      <td :colspan="headers.length" class="text-xs-right">
        <b>Totaal: &euro; {{ order.total.grand | fixed2 }}</b>
      </td>
    </tr>
    <tr v-if="shipping">
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
          return option.option + " : " + option.choice + (
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
