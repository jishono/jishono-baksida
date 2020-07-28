<template>
  <v-card>
    <v-card-title>
      <span v-if="language == 'no'">Instruks for oversetting</span>
      <span v-if="language == 'jap'">日本語</span>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-img
          @click="setSprak('no')"
          class="mx-1"
          aspect-ratio="1"
          max-height="25px"
          max-width="25px"
          src="@/assets/norge.svg"
        ></v-img>
      </v-btn>
      <v-btn icon>
        <v-img
          @click="setSprak('jap')"
          class="mx-1"
          aspect-ratio="1"
          max-height="25px"
          max-width="25px"
          src="@/assets/japan.svg"
        ></v-img>
      </v-btn>
    </v-card-title>
    <v-card-text v-if="language == 'no'">
      <div class="text-subtitle-2 font-weight-bold">Hvor mange forskjellige definisjoner skal ordet ha?</div>
      <p>Grunnregel: Hver unike betydning/konsept i det norske ordet skal ha en egen
        definisjon (eget felt) på japansk. Hvert felt kan også ha (og har veldig ofte) flere japanske ord som tilsammen
        representerer en god oversettelse. Skill hvert ord med et japansk komma 、</p>
      <p>Eksempel: "bilde"<br>
        1: 画、絵、写真、映像<br>
        2: 象徴、典型<br>
        3: 描写<br>
        4: たとえ、直喩<br>
        5: 活動状況、情勢<br>
      </p>
      <p>
        Fremgangsmåte: Slå først opp ordet i Bokmålsordboka (<a
          href="http://ordbok.uib.no"
          target="_blank"
        >ordbok.uib.no</a>)
        og se hvor mange betydninger de mener det norske ordet har. I de fleste tilfeller
        vil antallet definisjoner være det samme for oss. Dette gjelder dog ikke alltid,
        og det er lov å slå sammen definisjoner hvis man mener Bokmålsordboka bommer, eller
        hvis det ikke gir mening å skille mellom definisjonene på japansk, f.eks. om hver definisjon gir
        samme oversettelse. Det tyder på at flere konsepter i den norske betydningen er representert
        av ett og samme konsept på japansk.
      </p>
      <div class="text-subtitle-2 font-weight-bold">Forklaringer</div>
      <p>
        Noen ganger har et ord nyanser som ikke kommer godt frem i en oversettelse.
        Dette kan f.eks. være at det kun brukes i spesielle kontekster. I slike tilfeller
        kan man legge til en parantes med en forklaring.
      </p>
      <p> anmeldelse -><br>
        1: （警察などへの）届け出、報告<br>
        2: （映画などの）評価、レビュー
      </p>
      <p>
        Marker også slang eller svært uformelle ord med（俗語）og
        vulgære ord/banneord med（卑語）. Eks: kuk -> <v-icon
          small
          color="green"
        >
          mdi-checkbox-marked-circle
        </v-icon>（卑語）ちんぽ
      </p>
      <div class="text-subtitle-2 font-weight-bold">Regler for ordklasser</div>
      <p>
        Prøv så langt det er mulig å la de japanske oversettelsene ha samme ordklasse som på norsk.
        Et adjektiv på norsk bør være et adjektiv på japansk. Dette er selvsagt ikke alltid mulig,
        f.eks. hvis et adjektiv på norsk uttrykkes med et verb på japansk. I slike tilfeller bør man
        likevel verbet i oversettelsen gjenspeile "adjektiviteten" på norsk. Se eksempler for hver
        ordklasse under.
      </p>
      <p>
        Det finnes også oppslag (lemma) som er helt like, men som har forskjellige ordklasser.
        Vær veldig obs på at du oversetter ordet med korrekt ordklasse.
      </p>
      <p>
        I tillegg finnes det noen ord på norsk som skrives helt likt og som i tillegg har SAMME ordklasse.
        Et eksempel er de to substantive som heter "rot" (ei rot vs. et rot). I slike tilfeller bør du sjekke bøyningstabellen
        for å sjekke at du oversetter riktig ord.

      </p>
      <div class="text-subtitle-2 font-weight-bold">Adjektiv</div>
      <p>
        <ul>
          <li>Na-adjektiv skal slutte med な.
            <p> behagelig ->
              <v-icon
                small
                color="green"
              >
                mdi-checkbox-marked-circle
              </v-icon> 快適な
              <v-icon
                small
                color="red"
              >
                mdi-close-circle
              </v-icon> 快適
            </p>
          </li>

          <li>Verb på japansk som oversetter et adjektiv skal i utgangspunktet slutte med fortidsform ～た.
            Det finnes unntak hvor det blir unaturlig og ～ている passer bedre. Vurder selv.
            <p> lei ->
              <v-icon
                small
                color="green"
              >
                mdi-checkbox-marked-circle
              </v-icon> 飽きた
              <v-icon
                small
                color="red"
              >
                mdi-close-circle
              </v-icon> 飽きる
            </p>
          </li>
          <li>Substantiv på japansk som oversetter et adjektiv skal slutte med ～の, ～のある, ～のない, ～となる
            avhengig av hva som er naturlig på japansk. De to første er de mest frekvente.
            <p> aktuell ->
              <v-icon
                small
                color="green"
              >
                mdi-checkbox-marked-circle
              </v-icon> 実際の、見込みのある
              <v-icon
                small
                color="red"
              >
                mdi-close-circle
              </v-icon> 実際、見込み
            </p>
          </li>
        </ul>
      </p>
      <div class="text-subtitle-2 font-weight-bold">Adverb</div>
      <p>
        <ul>
          <li>Adverb oversettes slik at det japanske ordet også er et naturlig adverb
            <p> likevel ->
              <v-icon
                small
                color="green"
              >
                mdi-checkbox-marked-circle
              </v-icon> それでも、それにもかかわらず
            </p>
          </li>

          <li>Hvis et japansk adverb både kan ha に og で som partikkel kan du legge til に・で på slutten av ordet
            <p> framme ->
              <v-icon
                small
                color="green"
              >
                mdi-checkbox-marked-circle
              </v-icon> 前方に・で
              <v-icon
                small
                color="red"
              >
                mdi-close-circle
              </v-icon> 前方
            </p>
          </li>
        </ul>
      </p>

      <div class="text-subtitle-2 font-weight-bold">Substantiv</div>
      <p>
        <ul>
          <li>Substantiv skal oversettes til den vanlige grunnformen i japansk.
            <p> billett ->
              <v-icon
                small
                color="green"
              >
                mdi-checkbox-marked-circle
              </v-icon> 切符、チケット、入場券
            </p>
          </li>
          <li>Planter og dyr med kanji som ikke er 常用漢字 skal skrives med katakana
            <p> einstape ->
              <v-icon
                small
                color="green"
              >
                mdi-checkbox-marked-circle
              </v-icon> ワラビ
              <v-icon
                small
                color="red"
              >
                mdi-close-circle
              </v-icon> 蕨
            </p>
          </li>
        </ul>
      </p>
      <div class="text-subtitle-2 font-weight-bold">Verb</div>
      <p>
        <ul>
          <li>Verb skal oversettes til ru-form, IKKE teiru-form eller andre former.
            <p> spise ->
              <v-icon
                small
                color="green"
              >
                mdi-checkbox-marked-circle
              </v-icon> 食べる
              <v-icon
                small
                color="red"
              >
                mdi-close-circle
              </v-icon> 食べた・食べ・食べている
            </p>
          </li>
        </ul>
      </p>

    </v-card-text>
    <v-card-text v-if="language == 'jap'">
      日本語

    </v-card-text>
  </v-card>

</template>

<script>

export default {
  name: 'instruks-boks',
  data () {
    return {
      language: 'no',
    }
  },
  methods: {
    setSprak (sprak) {
      this.language = sprak
    }
  },
  mounted () {

  }
}

</script>