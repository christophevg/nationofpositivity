var Product = {
  template : `
<Page>
  <ProductCard :product="selected" layout="page" nolink/>
</Page>
`,
  mounted: function() {
    store.dispatch("select", this.$route.params.id);
  },
  computed : {
    selected : function() {
      return store.state.products.selected;
    }
  }
};

router.addRoutes([ { path: "/products/:id", component: Product } ]);
router.addRoutes([ { path: "/products",     redirect: "/shop"  } ]);
