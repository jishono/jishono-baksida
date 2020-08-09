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
            {{ $t('om.hovedtittel')}}
          </v-card-title>
          <v-card-text>
            <div class="text-subtitle-2 font-weight-bold">{{ $t('om.p1.tittel')}}</div>
            <p>{{ $t('om.p1.tekst')}} </p>

            <div class="text-subtitle-2 font-weight-bold">{{ $t('om.p2.tittel')}}</div>
            <p>
              {{ $t('om.p2.tekst')}}
            </p>

            <div class="text-subtitle-2 font-weight-bold">{{ $t('om.p3.tittel')}}</div>
            <p>
              {{ $t('om.p3.tekst')}}
            </p>
            <p>
              <ol>
                <li>
                  <router-link to="/registrer">{{ $t('om.p3.liste.1') }}</router-link>
                </li>
                <li>
                  <router-link to="/logginn">{{ $t('om.p3.liste.2') }}</router-link>
                </li>
                <li>{{ $t('om.p3.liste.31') }}<router-link to="/instruks">{{ $t('om.p3.liste.32') }}</router-link>{{ $t('om.p3.liste.33') }}</li>
                <li>{{ $t('om.p3.liste.4') }}</li>
                <li>{{ $t('om.p3.liste.5') }}</li>
                <li>{{ $t('om.p3.liste.6') }}</li>
              </ol>
            </p>
            <div class="text-subtitle-2 font-weight-bold">{{ $t('om.p4.tittel')}}</div>
            <p>{{ $t('om.p4.tekst1')}}</p>
            <p>{{ $t('om.p4.tekst2')}}</p>
            <div class="text-subtitle-2 font-weight-bold">{{ $t('om.p5.tittel')}}</div>
            <p v-html="$t('om.p5.tekst')"></p>
            <div class="text-subtitle-2 font-weight-bold">{{ $t('om.p6.tittel')}}</div>
            <p>{{ $t('om.p6.tekst')}}</p>
            <p v-html="$t('om.p6.liste')"> </p>
            <p>{{ $t('om.p6.kontakt')}}</p>

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