<template>
  <v-container class="pa-0">

    <v-row
      justify="center"
      no-gutters
    >
      <v-col
        md=6
        sm=10
        cols=12
      >
        <v-card>
          <v-card-title>
            Om "Baksida" til jisho.no
          </v-card-title>
          <v-card-text>
            <div class="text-subtitle-2 font-weight-bold">Hva slags side er dette?</div>
            <p>På Baksida skjer alt arbeidet med å lage oversettelsene som vises på jisho.no.
              Her finnes også statistikk og informasjon om de som oversetter. </p>

            <div class="text-subtitle-2 font-weight-bold">Hvem kan bruke Baksida?</div>
            <p>
              Alle! jisho.no er laget av frivillige, og det kan du også bli! Hvis du registrerer deg kan du også komme med forslag til nye oversettelser, og stemme
              på andres oversettelser. Det er åpent for alle og du trenger ikke spørre om lov for å bidra.
            </p>

            <div class="text-subtitle-2 font-weight-bold">Hvordan kan jeg bidra?</div>
            <p>
              Det vi trenger aller mest er flere oversettelser fra norsk til japansk, så den beste måten å bidra
              på er med oversetting. For å komme i gang med det må du gjøre følgende:
            </p>
            <p>
              <ol>
                <li>
                  <router-link to="/registrer">Registrer deg</router-link> som ny bruker
                </li>
                <li>
                  <router-link to="/logginn">Logg inn</router-link>
                </li>
                <li>Sett deg godt inn i <router-link to="/instruks">instruksen</router-link> for hvordan oversette ord på en god måte</li>
                <li>Besøk fanen "Oversett" og oversett enten ord som anbefales eller søk opp ord du selv vil oversette.</li>
                <li>Nye forslag til definisjoner (oversettelser) kan ses av alle og stemmes på under <router-link to="/forslag">fanen "Forslag"</router-link>. Kommenter også gjerne på andres oversettelser for å gi innspill.
                </li>
                <li>Hvis et forslag får 5 positive stemmer, eller hvis en admin godkjenner det direkte, legges det til i ordboka.
                  Ved 5 negative stemmer blir forslaget avvist.
                </li>
              </ol>
            </p>
            <div class="text-subtitle-2 font-weight-bold">Tar dere imot donasjoner?</div>
            <p>
              Det gjør vi gjerne! Siden jisho.no er et 100% frivillig non-profit prosjekt er vi avhengige av
              av brukernes hjelp for å betale servere og domener.
              Alle donasjoner, store og små, er velkomne og vil i sin helhet bli brukt til prosjektet. Skulle vi få inn mer enn vi
              trenger i overskuelig fremtid kommer vi til å stoppe å ta imot flere donasjoner.
            </p>
            <p>Vi tar kun imot på Vipps. Søk etter jisho.no eller nummer 616524.</p>
            <div class="text-subtitle-2 font-weight-bold">Trenger dere hjelp med programmering o.l.?</div>
            <p>
              Det kan godt være! Ta kontakt med Per Gunnar (se kontaktinfo nederst) og fortell hva
              du kunne tenke deg å bidra med. All kode er <a
                href="https://github.com/jishono/"
                target="_blank"
              >open source på Github</a>
              men det er best om vi har pratet sammen først før du bidrar med kode.
            </p>
            <div class="text-subtitle-2 font-weight-bold">Hvem er ansvarlig for jisho.no/baksida?</div>
            <p>
              Vi er et kjerneteam av følgende personer som har overordnet redaksjonelt ansvar og som jobber med kode og server.

            </p>
            <p>
              <ul>
                <li>
                  Per Gunnar Paulsen (hovedansvarlig, redaktør/admin på baksida, kode)
                </li>
                <li>
                  Petter Mæhlum (redaktør/admin på baksida)
                </li>
                <li>
                  Patrick Auri (kode, design)
                </li>
                <li>
                  Stian Frøystein (server)
                </li>
                <li>
                  Takaaki Yoshikawa (kode)
                </li>
              </ul>
            </p>
            <p>
              Alle spørsmål om prosjektet kan rettes til Per Gunnar på pergpau (alfakrøll) gmail.com
            </p>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>

export default {
  name: 'om',
  data () {
    return {

    }
  },
  methods: {

  },
  mounted () {

  }
}

</script>