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
            id: "proces",
            question: "Hoe verloopt mijn aankoop?",
            answer: `

            Het merendeel van onze producten worden gepersonaliseerd. Jouw
            input hierbij is belangrijk en je kan die op verschillende manieren
            aanleveren.
            
            In de <a href="/shop" onclick="router.push({path: '/shop'}); return
            false;">de shop</a> kan je bepaalde keuzes maken om jouw product te
            personaliseren (bv: van welk basisontwerp er mag vertrokken
            worden, welke tekst je graag wil...)
              
            Sommige artikels bieden de mogelijkheid om een eigen foto of logo
            toe te voegen. Deze bestanden kan je als antwoord op onze
            bevestigingsmail naar ons toe zenden.
              
            Nadat wij alle personalisaties aangebracht hebben sturen we je per
            email een visualisatie toe hoe het resultaat er gaat uitzien. Je
            kan dan eventueel nog één maal bijkomende instructies geven om de
            "finishing touches" aan te brengen. Of je meldt ons gewoon dat het
            ontwerp klaar is voor productie.
              
            De volgende stappen zijn dan nog: productie, verzending en
            ontvangst van jouw stukje positiviteit bij jouw thuis.

`
          },
          {
            id: "doorlooptijd",
            question: "Hoe lang duurt het voor ik mijn aankoop ontvang?",
            answer: `
            
            Vanaf het moment dat we jouw order ontvangen én we bevestiging van
            betaling hebben, beginnen we zo snel mogelijk aan de
            personalisatie. Als de personalisatie nog input van jou nodig heeft
            (bv: een foto of logo), wachten we natuurlijk nog even op jouw
            mailtje.
            
            De meeste personalisaties zijn klaar binnen een werkdag. Dan
            wachten wij weer even op jouw feedback en/of bevestiging.
            
            Na ontvangst van de bevestiging, begint de productie. Ook deze is
            meestal klaar binnen een werkdag. Echter, afhankelijk van het
            aantal en de omvang van de orders die op een gegeven moment in
            productie zijn, kan dit oplopen. We verwittigen je tijdig per email
            indien dit een aanzienlijke vertraging met zich zou meebrengen.
            
            Na productie verpakken we jouw aankoop en brengen die naar de
            transportdienst. In normale omstandigheden zal deze jouw pakket
            binnen 1 à 2 werkdagen aanbieden op jouw adres.
            
`
          },
          {
            id: "hout",
            question: "Mijn houten artikel ruikt verbrand. Is dat normaal?",
            answer: `

            Absoluut. We gebruiken een lasersnijder om jouw artikel uit een
            houten plaat te snijden. Een laser brandt letterlijk een heel dun
            lijntje hout weg. Hierbij blijft een klein beetje roet over aan de
            randen. Hierdoor blijft de geur van verbrand hout ook aanwezig.

            Daarom kan het ook zijn dat als je over de randen gaat, dat nog een
            beetje van het roet afgeeft. Als deel van de productie van jouw
            artikel behandelen we de randen zo goed mogelijk om zo veel
            mogelijk roet te verwijderen, echter er kan altijd nog een beetje
            overblijven.

            Hout is een natuurlijk product en de verbranding ervan is ook een
            natuurlijk proces. Hopelijk deel je onze mening dat de typische
            geur een extra charme-dimensie geeft aan het resultaat.

`
          },
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
            
            Je kan kiezen om je order zelf via een bankoverschrijving te
            betalen. We wachten op jouw betaling en beginnen er dan aan te
            werken. Je ontvangt van ons bij de bevestigingsmail alle informatie
            om de overschrijving uit te voeren, inclusief een handige QR code.
            
            Je kan ook kiezen om online te betalen. We verwijzen je dan door
            naar onze betaalpartner, Mollie. Op dit moment voorzien we op die
            manier Bancontact als optie en rekenen we &euro; 0.39
            transactiekosten aan.
            
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
