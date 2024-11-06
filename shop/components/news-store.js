store.registerModule("news", {
  state: {
    items: [],
  },
  mutations: {
    news_items: function(state, items) {
      state.items = items;
    }
  },
  getters: {
    news_items: function(state) {
      if(state.items.length == 0) {
        store.dispatch("refresh_news");
      }
      return state.items;
    }
  },
  actions: {
    refresh_news: function(context) {
      $.get({
        url: "/api/news",
        success: function(response) {
          context.commit("news_items", response.content);
        }
      });
    }
  }
});
