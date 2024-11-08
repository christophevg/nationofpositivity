var Unknown = {
  template : `
<Page>
  <h1>Whoops... 🫣</h1>

  <h2>
    Sorry, de informatie die je zoekt is <i>foetsjie</i>.
  </h2>
  
  <p>
  
    Gebruik de navigatie om terug op het goede pad terecht te komen. Je vind de
    navigatie links, eventueel te openen via het blauwe logo bovenaan.
  
  </p>
  
  <p>
  
    Start bv op de <router-link to="/">ontvangstpagina</router-link> of duik
    regelrecht <router-link to="/shop">in de shop</router-link>.
  
  </p>
  
  <p>
  
    Hopelijk vind je snel terug wat je zocht. Indien niet, <router-link
    to="/contact">contacteer ons</router-link>!
  
  </p>
  
  <p>
    <br><br><br><br>
  </p>
  
</Page>  
  `
};

router.addRoutes([ { path: "*",  component: Unknown } ]);
