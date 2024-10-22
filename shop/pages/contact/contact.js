var Contact = {
  template : `
<Page>
  <h1>Contact</h1>

  <p>
    Heb je een vraag die bv. niet beantwoord werd in onze <a href="/faq">vraag &
    antwoord sectie</a>? Dan kan je ons altijd een mailtje sturen via <a
    href="mailto:contact@nationofpositivity.com">contact@nationofpositivity.com</a>.
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
