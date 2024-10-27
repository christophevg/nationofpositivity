var Faq = {
  template : `
<Page>

  <h1>Vraag & Antwoord</h1>
  
  <p>
  
    Hieronder verzamelen we antwoorden op vragen die je mogelijks nog hebt. Als
    je na consultatie ervan nog geen antwoord hebt, neem dan <a
    href="/contact" @click.prevent="$router.push('/contact')">contact</a> op.
  
  </p>
  
  <v-card v-for="(faq, i) in model.faqs" :key="i" class="mb-3">
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ faq.question }}</h3>
        <p v-for="(para, p) in faq.answer.split(/\\n\\s*\\n/)" :key="p"
           v-html="para"></p>
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
            question: "Help! Ik krijg foutboodschappen. Wat moet ik doen?",
            answer: `
            
            Net zoals alle spulletjes in <a href="/shop"
            onclick="router.push({path: '/shop'}); return false;">de shop</a>,
            is de shop zelf ook met veel liefde gepersonaliseerd en op maat
            gemaakt van Nation of Positivity. We werken er constant aan en soms
            sluipen er foutjes in.
            
            Geen nood. Normaal gezien merken we dit zelf snel genoeg op en
            lossen het probleem onmiddellijk op. Als het toch iets langer duurt
            dan je zou hopen, geef ons dan <a href="/contact"
            onclick="router.push({path: '/contact'}); return false;">een
            seintje</a>. Je feedback wordt enorm geapprecieerd en zo maken we
            de site alvast samen weer dat ietsje beter en leuker.

            `
          },
          {
            question: "Gebruikt deze site cookies?",
            answer: `
    
            Kort antwoord: neen, "Nation of Positivity" gebruikt geen cookies.
            Iets langer antwoord: neen, "Nation of Positivity" gebruikt geen
            cookies, ook geen pagina analyse tools, geen tracker pixels, niets.
            
            Je gegevens zoals je huidig mandje en je contact gegevens worden
            wel opgeslagen op jouw computer om bij een volgend bezoek opnieuw
            gebruikt te kunnen worden. Deze gegevens worden alleen in jouw
            browser gebruikt, in tegenstelling tot cookies die telkens naar de
            server worden mee gestuurd.

`
          },
          {
            question: "Welke opties om te betalen worden aangeboden?",
            answer: `
            
            Je kan kiezen om je order via een bankoverschrijving te betalen. We
            wachten op jouw betaling en beginnen er dan aan te werken. Je
            ontvangt van ons bij de bevestigingsmail alle informatie om de
            overschrijving uit te voeren, inclusief een handige QR code.
            
            Je kan ook kiezen om online te betalen. We verwijzen je dan door
            naar onze betaalpartner, Mollie. Voor het gebruik van hun diensten
            rekenen we &euro; 0.39 aan.

`
          },
          {
            question: "Hoe ontvang ik mijn stukje positiviteit?",
            answer: `
            
            We werken samen met GLS om jouw order in ideale omstandigheden tot
            bij jou te brengen. Hiervoor rekenen we &euro; 5.60 aan.
            
`
          },
          {
            question: "Mag ik doen en laten wat ik wil?",
            answer: `
    
            Neen, spijtig genoeg zijn er wel enkele beperkingen waar iedereen
            zich moet aan houden. In geval van normaal gebruik van de website
            en mijn diensten, gaat dit nooit een probleem zijn. Echter, indien
            ik onregelmatigheden vaststel (bv. je hebt geprutst met de website
            en/of je order), je bestelt gepersonaliseerde artikels waarvan de
            personalisatie niet in lijn is met de wetgeving en/of acceptabele
            gebruiken en/of voorstellingen, behoud ik mij het recht om je order
            te weigeren, waarbij ik reeds betaalde gelden gewoon zal terug
            storten (minus een administratieve kost van 20 euro).
            
`
          },
          {
            question: "Wie of wat is Nation of Positivity?",
            answer: `
            
            Nation of Positivity is een initiatief van <a
            href="https://christophe.vg" target="_blank">Christophe Van
            Ginneken</a>.
            
            Administratief wordt het gedragen door <a
            href="https://2know.be" target="_blank">2Know BV</a>.
            
            Je vind alle contactgegevens op de <a href="/contact"
            onclick="router.push({path:'/contact'}); return false">contact
            pagina</a>.

` 
          },
          {
            question: "Wat betekent 'protected by reCAPTCHA'?",
            answer: `
    
            <a href="https://developers.google.com/recaptcha"
            target="_blank">reCAPTCHA</a> is een transparante technologie van
            Google die jouw activiteit op de site bekijkt om te bepalen of je
            echt een mens bent. Deze conclusie gebruiken we tijdens het
            registreren van jouw order om kwaadwilligen een beetje tegen te
            werken. Als alles goed gaat merk jij hier alvast niets van.

`
          }
        ]
      }
    }
  }
};

Navigation.add(Faq)
