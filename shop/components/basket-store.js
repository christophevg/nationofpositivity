// basket / order

function round2(value) {
  return Math.round(value * 100) / 100;
}

store.registerModule("basket", {
  state: {
    order: [],
    payment: false,
    badge: {
      visible : false,
      text    : 0,
      color   : "green"
    }
  },
  getters: {
    lines: function(state) {
      return state.order.map(function(item){
        if(! item.options || ! item.options.length ) { item.options = []; }
        var unit_price = item.product.unit_price + item.options.reduce(function(total, option){
          return total + option.cost;
        }, 0);
        return {
          product   : item.product,
          options   : item.options,
          amount    : item.amount,
          unit_price: unit_price,
          line_total: unit_price * item.amount
        }
      });
    },
    lines_total: function(state, getters) {
      return getters.lines.reduce(function(total, item) {
        return total + item.line_total;
      }, 0);
    },
    item_count: function(state, getters) {
      return getters.lines.reduce(function(total, item) {
        return total + item.amount;
      }, 0);
    },
    shipping_costs: function(state) {
      return [
        { format: "XS", cost:  5.60 }, // 1
        { format: "S",  cost:  6.60 }, // 2
        { format: "M",  cost:  7.60 }, // 3
        { format: "L",  cost:  9.30 }, // 4
        { format: "L",  cost:  9.30 }, // 5
        { format: "L",  cost:  9.30 }, // 6
        { format: "XL", cost: 12.90 }  // 7 ...
      ];
    },
    shipping_method: function(state, getters) {
      var items = getters.item_count;
      items = items > 7 ? 7 : items;
      return getters.shipping_costs[items-1];
    },
    shipping_format: function(state, getters) {
      return getters.shipping_method.format;
    },
    shipping_total: function(state, getters) {
      return getters.shipping_method.cost;
    },
    payment_total: function(state, getters) {
      return state.payment ? 0.39 : 0;
    },
    total: function(state, getters) {
      return getters.lines_total 
           + getters.payment_total
           + getters.shipping_total;
    },
    order : function(state, getters) {
      return {
        lines     : getters.lines,
        total: {
          lines   : round2(getters.lines_total),
          shipping: round2(getters.shipping_total),
          payment : round2(getters.payment_total),
          grand   : round2(getters.total),
          tax     : round2(getters.total - (getters.total / 1.21))
        }
      }
    }
  },
  actions: {
    refresh_basket: function(context) {
      context.state.order.forEach(function(line) {
        $.get({
          url: "/api/products/" + line.product.id,
          success: function(response) {
            context.commit("update_product", response);
          },
          error: function(response) {
            console.log(response);
          }
        }); 
      });
    }
  },
  mutations: {
    update_payment: function(state, value) {
      state.payment = value;
    },
    update_product: function(state, product) {
      var existing = state.order.find(function(item){
        return item.product.id == product.id;
      });
      if(existing) {
        existing.product = product;
        // TODO: refresh selected options' costs
        console.log("updated product", product);
      }
    },
    add_to_basket: function(state, selection) {
      // if the product is already in the basket, increase the amount and update
      // product to reflect latest version of object
      console.log("adding to basket", selection);
      var existing = state.order.find(function(item) {
        if( item.product.id != selection.product.id ) { return false; }
        if( item.options.length != selection.options.length ) { return false; }
        // same product and amount of options: check if options are the same
        for(var idx in selection.options) {
          var option = selection.options[idx];
          if(! item.options.find(function(current_option) {
            return (option.option == current_option.option) && (option.choice == current_option.choice);
          })) { return false };
        }
        return true;
      });
      if(existing) {
        existing.amount += 1;
        existing.product = selection.product; // update with latest info
      } else {
        state.order.push({ product: selection.product, amount: 1, options: selection.options, comments: "" });
      }

      // update badge properties
      // we need to do it this way, because a getter dynamically building this
      // property doesn't seem to be reactive enough ;-)
      state.badge.text += 1;
      state.badge.visible = state.badge.text > 0;
    },
    remove_from_basket: function(state, selection) {
      var existing = state.order.find(function(item) {
        if( item.product.id != selection.product.id ) { return false; }
        if( item.options.length != selection.options.length ) { return false; }
        // same product and amount of options: check if options are the same
        for(var idx in selection.options) {
          var option = selection.options[idx];
          if(! item.options.find(function(current_option) {
            return (option.option == current_option.option) && (option.choice == current_option.choice);
          })) { return false };
        }
        return true;
      });
      if(existing) {
        existing.amount -= 1;
        // prune (any) orderline with zero "amount"
        state.order = state.order.filter(function(item){
          return item.amount > 0;
        });
        // update badge properties
        // we need to do it this way, because a getter dynamically building this
        // property doesn't seem to be reactive enough ;-)
        state.badge.text -= 1;
        state.badge.visible = state.badge.text > 0;
      }
    },
    initialise_basket: function(state) {
			if(localStorage.getItem("basket")) {
			  var cache = JSON.parse(localStorage.getItem("basket"));
        Vue.set(state, "order", cache.order);
        state.badge.visible = cache.badge.visible;
        state.badge.text    = cache.order.reduce(function(count, line){
          return count + line.amount;
        }, 0);
		  }
    },
    clear_basket: function(state) {
      Vue.set(state, "order", []);
      state.payment = false;
      state.badge.visible = false;
      state.badge.text    = 0;
    }
  }
});

// cache basket in localstorage

store.subscribe((mutation, state) => {
  if([ "add_to_basket", "remove_from_basket", "clear_basket" ].includes(mutation.type)) {
    localStorage.setItem("basket", JSON.stringify(state.basket));
  }
});

before_app_mount( function() { store.commit("initialise_basket"); } );

// trigger a refresh after initialisation

store.subscribe( function(mutation, state) {
  if( mutation.type === "initialise_basket" ) {
    store.dispatch("refresh_basket");
  }
});
