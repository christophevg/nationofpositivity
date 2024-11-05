var Index = {
  mixins: [ Content ],
  template : `
<Page>
  <v-layout justify-center row fill-height>
    <v-flex xs12 sm6 md8>
      <v-card v-for="(item, i) in model.items" :key="i" class="mb-3">
        <v-img :src="cdn(item.image)" aspect-ratio="2"></v-img>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{ item.title }}</h3>
            <h2><v-icon>event</v-icon>&nbsp;&nbsp;{{ item.date }}</h2>
            <div style="padding-top:10px">
              <p v-for="(para, p) in item.body.split(/\\n\\s*\\n/)" :key="p"
                 v-html="para"></p>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>  
</Page>
`,
  navigation: {
    section: null,
    icon:    "home",
    text:    "Welkom",
    path:    "/",
    index:   1
  },
  data: function() {
    return {
      model: {
        items: [
          {
            image: "images/products/holidays-are-coming/designs.jpeg",
            title: "🆕 Nieuw kaartontwerp en meer designopties 🎄⭐️🦌",
            date:  "4 november 2024",
            body: `
            
            We hadden het beloofd: hier zijn <b>3 nieuwe designs</b> voor de
            bestaande kerstbal-gebaseerde kaarten <b>én</b> een <b>gloednieuwe
            kaart</b>. Naast je kerstbal kan je nu ook een heuse <b>slinger</b>
            in de kerstboom van jouw gelukkige ontvanger hangen. En natuurlijk
            kan je in dit originele ontwerp van Nation of Positivity niet
            alleen <a href="/shop" onclick="router.push({path:
            '/products/garland-with-text'}); return false;">jouw wens</a> ,
            maar ook <a href="/shop" onclick="router.push({path:
            '/products/garland-with-logo'}); return false;">jouw logo</a> of <a
            href="/shop" onclick="router.push({path:
            '/products/garland-with-picture'}); return false;">eigen
            foto's'</a> laten verwerken.

            Je vind nu dus nog meer ideeën, voorbeelden en vooral mogelijkheden
            in <a href="/shop" onclick="router.push({path: '/shop'}); return
            false;">de shop</a> . We blijven de komende dagen en weken nog meer
            designs en kaarten toevoegen voor jouw positieve eindejaarswensen!

`
          },
          {
            image: "images/products/holidays-are-coming/collection.jpeg",
            title: "🚀 Stuur dit jaar wensen boordevol positiviteit!",
            date:  "29 oktober 2024",
            body: `
            <b>Geef het geschenk van positiviteit!</b> Bij <b>Nation of Positivity</b>
            vind je tal van kleine leuke attenties. Allemaal gepersonaliseerd en bedoeld
            om jouw positiviteit aan iemand anders te kunnen schenken (of stiekem gewoon
            voor jezelf te houden 😇). Met Nation of Positivity bied ik mijn atelier en
            eigen werk aan in een kleine online shop. Met liefde gemaakt om met veel
            liefde te geven. Samen zorgen we voor wat meer positiviteit in de wereld.
   
            We lanceren Nation of Positivity vandaag met onze eerste
            seizoens-gebonden collectie in kader van de komende
            eindejaarsfeesten. De <b>"Holidays are coming" collectie</b>
            bestaat uit een reeks van gepersonaliseerde, houten wenskaarten,
            waarmee je jouw wensen dit jaar nét dat ietsje meer positiviteit
            geeft. Je vind nu al veel ideeën, voorbeelden en mogelijkheden in
            <a href="/shop" onclick="router.push({path: '/shop'}); return
            false;">de shop</a> . De komende dagen en weken vullen we deze
            eerste serie aan met nog veel meer leuke ontwerpen om van te
            starten.

`
          }
        ]
      }
    }
  }
};

Navigation.add(Index)
