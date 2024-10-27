var Contact = {
  template : `
<Page>
  <h1>Contact</h1>

  <p>

    Heb je een vraag die bv. niet beantwoord werd in onze <a href="/faq"
    @click.prevent="$router.push({path:'/faq'})">vraag & antwoord sectie</a>?<br>
    Ben je op een probleempje met de site gebotst?<br>
    Heb je een idee om Nation of Positivity nog positiever te maken?<br>
    Vind je nét niet wat je zoekt of wil je iets heel specifiek?
    
  </p>
  
  <p>

    Aarzel dan niet om contact op te nemen:

  </p>
    
  <p>
  
    Christophe Van Ginneken / 2Know BV<br>
    Veldonkweg 2A<br>
    3128 Baal<br>
    <a href="mailto:contact@nationofpositivity.com">contact@nationofpositivity.com</a><br>
    BE0865.835.163<br>
    KBC BE14.7370.5585.6683
  </p>
  
</Page>  
`,
  navigation: {
    section: null,
    icon:    "alternate_email",
    text:    "Contact",
    path:    "/contact", 
    index:   5
  }
};

Navigation.add(Contact)
