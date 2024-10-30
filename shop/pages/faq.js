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
    <a :id="faq.id" :name="faq.id"/>
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
            id: "errors",
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
            id: "cookies",
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
            id: "betalen",
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
            id: "verzending",
            question: "Hoe ontvang ik mijn stukje positiviteit?",
            answer: `
            
            We werken samen met GLS om jouw order in ideale omstandigheden tot
            bij jou te brengen. Afhankelijk van de omvang van je order rekenen
            we de overeenkomstige kost van GLS aan. De basiskost voor de meeste
            artikels is &euro; 5.60.
            
`
          },
          {
            id: "privacy",
            question: "Zijn mijn persoonsgegevens veilig?",
            answer: `

              We doen er alles aan om jouw privégegevens ook echt privé te houden. We vragen gegevens van jou, zodat we je zo goed mogelijk kunnen helpen. Welke gegevens we vragen en waarvoor we ze gebruiken lees je hieronder. Ook zie je wat je rechten zijn, wie toegang heeft tot je data en hoe lang we je gegevens bewaren.
            
              Dit privacybeleid is voor het laatst gewijzigd op 28 oktober 2024.
            
            Volgens de privacywetgeving moeten we zeggen welke ‘juridische gronden’ we hebben om je gegevens te gebruiken. We hebben gegevens van je nodig vanwege de contractuele afspraken tussen jou en Nation of Positivity, zoals jouw aankoop van een product. Dit is het geval bij:

            <ul>
              <li>Bestellen</li>
              <li>Levering</li>
              <li>Retour</li>
              <li>Contact met ons</li>
            </ul>
            
            We geven je gegevens alleen door aan andere partijen als dat echt nodig is voor onze dienstverlening. Het betreft dan deze partijen: bezorgpartners en betaalpartners. Onze bezorgpartner moet tenslotte je bestelling afleveren op het juiste adres. In verdachte situaties zijn we verplicht om klantgegevens te delen met overheidsinstanties.
            
            De partijen die van ons toegang krijgen tot je gegevens, mogen deze alleen gebruiken om jou een dienst te leveren namens Nation of Positivity. Tenzij ze zelf verantwoordelijk zijn voor het verkrijgen en beschermen van je gegevens.
            
            We verkopen jouw gegevens nooit aan derden.
            
            We slaan je gegevens op in databases. We hanteren altijd strenge beveiligingsmaatregelen. Deze databases bevinden zich bunnen de Europese Unie.
            
            We bewaren en gebruiken jouw gegevens niet langer dan noodzakelijk. Daarna verwijderen we alle data die we van je hebben. Of gebruiken we jouw gegevens anoniem, omdat we bepaalde data nodig hebben voor interne analyses en rapportages zoals de waarde van je bestelling.
            
            Van de Belastingdienst moeten we onze administratie met jouw factuur-, betaal- en bestelgegevens 7 jaar bewaren.
            
            Gegevens die we gebruiken om fraude te voorkomen bewaren we heel lang. Niet leuk, wel nodig.
            
            Aankopen bij Nation of Positivity gebeuren ook niet met een account. We bewaren jouw persoonsgegevens dus niet. We registreren deze enkel als deel van een order.
`
          },
          {
            id: "aup",
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
            id: "wie",
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
            id: "credits",
            question: "Aan wie hebben we dit allemaal te danken?",
            answer: `
            
            Nation of Positivity geeft graag volgende personen/organisaties
            krediet voor hun ontwerpen, materiaal, diensten...
            
            <ul>
              <li>
                <a href="https://www.fontsquirrel.com/fonts/list/foundry/natalia-kasatkina" target="_blank">Natalia Kasatkina</a> voor haar leuk
                <a href="https://www.fontsquirrel.com/fonts/cherry-swash" target="_blank">Cherry Swash lettertype</a>. Dit is het lettertype van het Nation of Positivity logo.
              </li>
              <li>
                <a href="https://www.pexels.com/@cottonbro/" target="_blank">Cottonbro Studio</a> voor de super positieve vibe in de video met 
                <a href="https://www.pexels.com/video/a-boy-standing-in-front-of-a-video-game-machine-4841882/" target="_blank">het jongentje in de speelhal</a>. We gebruiken deze video en afbeeldingen eruit als background voor onze socials.
              </li>
            </ul>
            
`
          },
          {
            id: "recaptcha",
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
