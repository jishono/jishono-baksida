<template>
  <v-card>
    <v-card-title>
      Instruks for oversetting
    </v-card-title>
    <v-card-text>
      <div class="text-subtitle-2 font-weight-bold">{{ $t('instruks.p1.tittel')}}</div>
      <p>{{ $t('instruks.p1.tekst1') }}</p>
      <p>{{ $t('instruks.p1.eksempel') }} "bilde" -><br>
        1: 画、絵、写真、映像<br>
        2: 象徴、典型<br>
        3: 描写<br>
        4: たとえ、直喩<br>
        5: 活動状況、情勢<br>
      </p>
      <p v-html="$t('instruks.p1.tekst2')"></p>
      <div class="text-subtitle-2 font-weight-bold">{{ $t('instruks.p2.tittel')}}</div>
      <p>{{ $t('instruks.p2.tekst1') }}</p>
      <p> anmeldelse -><br>
        1: （警察などへの）届け出、報告<br>
        2: （映画などの）評価、レビュー
      </p>
      <p>{{ $t('instruks.p2.tekst2') }} {{ $t('instruks.p2.eksempel') }} kuk -> <v-icon
          small
          color="green"
        >
          mdi-checkbox-marked-circle
        </v-icon>（卑語）ちんぽ
      </p>
      <div class="text-subtitle-2 font-weight-bold">{{ $t('instruks.p3.tittel')}}</div>
      <p>{{ $t('instruks.p3.tekst1') }}</p>
      <p>{{ $t('instruks.p3.tekst2') }}</p>
      <p>{{ $t('instruks.p3.tekst3') }}</p>
      <div class="text-subtitle-2 font-weight-bold">{{ $t('instruks.adjektiv.tittel') }}</div>
      <p>
        <ul>
          <li>{{ $t('instruks.adjektiv.punkt1') }}
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

          <li>{{ $t('instruks.adjektiv.punkt2') }}
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
          <li>{{ $t('instruks.adjektiv.punkt3') }}
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
      <div class="text-subtitle-2 font-weight-bold">{{ $t('instruks.adverb.tittel') }}</div>
      <p>
        <ul>
          <li>{{ $t('instruks.adverb.punkt1') }}
            <p> likevel ->
              <v-icon
                small
                color="green"
              >
                mdi-checkbox-marked-circle
              </v-icon> それでも、それにもかかわらず
            </p>
          </li>

          <li>{{ $t('instruks.adverb.punkt2') }}
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

      <div class="text-subtitle-2 font-weight-bold">{{ $t('instruks.substantiv.tittel') }}</div>
      <p>
        <ul>
          <li>{{ $t('instruks.substantiv.punkt1') }}
            <p> billett ->
              <v-icon
                small
                color="green"
              >
                mdi-checkbox-marked-circle
              </v-icon> 切符、チケット、入場券
            </p>
          </li>
          <li>{{ $t('instruks.substantiv.punkt2') }}
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
      <div class="text-subtitle-2 font-weight-bold">{{ $t('instruks.verb.tittel') }}</div>
      <p>
        <ul>
          <li>{{ $t('instruks.verb.punkt1') }}
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
  </v-card>

</template>

<script>

export default {
  name: 'instruks-boks',
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