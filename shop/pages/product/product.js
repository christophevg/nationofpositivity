var Product = {
  template : `
<Page>
  <ProductCard :product="selected" layout="page" nolink/>
</Page>
`,
  created: function() {
    store.dispatch("select", this.$route.params.id);
  },
  computed : {
    selected : function() {
      return store.state.products.selected;
    }
  }
};

router.addRoutes([ { path: "/products/:id", component: Product } ]);
