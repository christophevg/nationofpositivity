var Index = {
  mixins: [ Content ],
  template : `
<Page>
  <v-layout justify-center row fill-height>
    <v-flex xs12 sm6 md8>
      <v-card v-for="(item, i) in model.items" :key="i" class="mb-3">
        <v-img :src="cdn(item.image)" aspect-ratio="2.75"></v-img>
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
            image: "images/news/holiday-season.jpeg",
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
            geeft. Je vind veel ideeën, voorbeelden en mogelijkheden in <a
            href="/shop" onclick="router.push({path: '/shop'}); return
            false;">de shop</a> . ` } ] } } }
  
};

Navigation.add(Index)
