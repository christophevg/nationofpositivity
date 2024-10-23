var Faq = {
  template : `
<Page>

  <h1>Vraag & Antwoord</h1>
  
  <p>
  
    Hieronder verzamelen we antwoorden op vragen die je mogelijks nog hebt. Als
    je na consultatie ervan nog geen antwoord hebt, neem dan <a
    href="/contact">contact</a> op.
  
  </p>
  
  <v-card v-for="(faq, i) in model.faqs" :key="i" class="mb-3">
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ faq.question }}</h3>
        <div v-html="faq.answer"></div>
      </div>
    </v-card-title>
  </v-card>
  
</Page>
`,
  navigation: {
    section: null, 
    icon:    "question_answer",
    text:    "Vraag & Antwoord", 
    path:    "/faq",
    index:   4
  },
  data: function() {
    return  {
      model : {
        faqs : [
          {
            question: "Gebruikt deze site cookies?",
            answer: `
    
            <p>Kort antwoord: neen, "Nation of Positivity" gebruikt geen
            cookies. Iets langer antwoord: neen, "Nation of Positivity"
            gebruikt geen cookies, ook geen pagina analyse tools, geen tracker
            pixels, niets.</p>
            
            <p>Je gegevens zoals je huidig mandje en je contact gegevens worden
            wel opgeslagen op jouw computer om bij een volgend bezoek opnieuw
            gebruikt te kunnen worden. Deze gegevens worden alleen in jouw
            browser gebruikt, in tegenstelling tot cookies die telkens naar de
            server worden mee gestuurd.</p>

`
          },
          {
            question: "Welke opties om te betalen worden aangeboden?",
            answer: `
            
            <p>Je kan kiezen om je order via een bankoverschrijving te betalen.
            We wachten op jouw betaling en beginnen dan aan je te werken.</p>
            
            <p>Je kan ook kiezen om online te betalen. We verwijzen je dan door
            naar onze betaalpartner, Mollie. Voor het gebruik van hun diensten
            rekenen we &euro; 0.35 aan.</p>

`
          },
          {
            question: "Hoe ontvang ik mijn stukje positiviteit?",
            answer: `
            
            <p>We werken samen met GLS om jouw order in ideale omstandigheden
            tot bij jou te brengen. Hiervoor rekenen we &euro; 5.60 aan.</p>
            
`
          },
          {
            question: "Wat betekent 'protected by reCAPTCHA'?",
            answer: `
    
           <p><a href="https://developers.google.com/recaptcha">reCAPTCHA</a> is
            een transparante technologie van Google die jouw activiteit op de
            site bekijkt om te bepalen of je echt een mens bent. Deze conclusie
            gebruiken we tijdens het registreren van jouw order om
            kwaadwilligen een beetje tegen te werken. Als alles goed gaat merk
            jij hier alvast niets van.</p>

`
          },
          {
            question: "Mag ik doen en laten wat ik wil?",
            answer: `
    
            <p>Neen, spijtig genoeg zijn er wel enkele beperkingen waar iedereen
            zich moet aan houden. In geval van normaal gebruik van de website
            en mijn diensten, gaat dit nooit een probleem zijn. Echter, indien
            ik onregelmatigheden vaststel (bv. je hebt geprutst met de website
            en/of je order), je bestelt gepersonaliseerde artikels waarvan de
            personalisatie niet in lijn is met de wetgeving en/of acceptabele
            gebruiken en/of voorstellingen, behoud ik mij het recht om je order
            te weigeren, waarbij ik reeds betaalde gelden gewoon zal terug
            storten (minus een administratieve kost van 20 euro).</p>
            
`
          },
          {
            question: "Wie of wat is Nation of Positivity?",
            answer: `
            
            <p>Nation of Positivity is een initiatief van <a
            href="https://christophe.vg" target="_blank">Christophe Van
            Ginneken</a>.</p>
            
            <p>Administratief wordt het gedragen door <a
            href="https://2know.be" target="_blank">2Know BV</a>.</p>
            
            <p>Je kan ons contacteren via Veldonkweg 2A, 3128 Baal -
            +32(0)498/62.33.29.</p>

` 
          }
        ]
      }
    }
  }
};

Navigation.add(Faq)
