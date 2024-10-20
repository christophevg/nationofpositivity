var Index = {
  template : `
<Page>
  <v-layout justify-center row fill-height>
    <v-flex xs12 sm6 md8>
      <v-card>
      <v-img
        src="https://cdn.nationofpositivity.com/assets/images/new/holiday-season.jpeg"
        aspect-ratio="2.75"
      ></v-img>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Stuur wensen vol positiviteit!</h3>
            <h2><v-icon>event</v-icon>&nbsp;&nbsp;23 oktober 2024</h2>
            <div>

<p>

  Geef het geschenk van positiviteit! In de Nation of Positivity vind je tal
  van kleine leuke attenties. Allemaal gepersonaliseerd en bedoeld om jouw
  positiviteit aan iemand anders te kunnen schenken. Met Nation of Positivity
  bied ik mijn atelier en eigen werk aan in een kleine online shop. Met liefde
  gemaakt om met veel liefde te geven. Samen zorgen we voor wat meer
  positiviteit in de wereld.

</p>
  
<p>
  
  In <a href="/shop">de shop</a> vind je kleine leuke dingen waar je blij van
  wordt, jouw stukje positiviteit om te geven (of gewoon voor jezelf).

</p>        

<p>
        
  We starten vandaag met een eerste seizoens-gebonden collectie in kader van de
  komende eindejaarsfeesten.
  
</p>
  
<p>

  Zowat alle artikels kunnen gepersonaliseerd worden. Je vind veel ideeën,
  voorbeelden en mogelijkheden in de shop. Laat je fantasie de vrije loop en
  verzend dit jaar wensen waarbij de ontvanger echt dat tikkeltje
  extra positiviteit voelt.
  
</p>

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
  }
};

Navigation.add(Index)
