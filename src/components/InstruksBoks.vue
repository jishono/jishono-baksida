<template>
  <div class="text-body-2 pa-4">
    <h1 class="text-title">Instruks for oversetting</h1>
    <h2 class="text-subtitle-1 font-weight-bold mt-4">
      {{ $t("instruks.p1.tittel") }}
    </h2>
    <p>{{ $t("instruks.p1.tekst1") }}</p>
    <p>
      {{ $t("instruks.p1.eksempel") }} "bilde" -><br />
      1: 画、絵、写真、映像<br />
      2: 象徴、典型<br />
      3: 描写<br />
      4: たとえ、直喩<br />
      5: 活動状況、情勢<br />
    </p>
    <p v-html="$t('instruks.p1.tekst2')"></p>
    <h2 class="text-subtitle-1 font-weight-bold mt-4">
      {{ $t("instruks.p2.tittel") }}
    </h2>
    <p>{{ $t("instruks.p2.tekst1") }}</p>
    <p>
      anmeldelse -><br />
      1: （警察などへの）届け出、報告<br />
      2: （映画などの）評価、レビュー
    </p>
    <p>
      {{ $t("instruks.p2.tekst2") }} {{ $t("instruks.p2.eksempel") }} faen ->
      <v-icon small color="green"> mdi-checkbox-marked-circle </v-icon
      >（卑語）ちくしょう！、くそ！
    </p>
    <h2 class="text-subtitle-1 font-weight-bold mt-4">
      {{ $t("instruks.p3.tittel") }}
    </h2>
    <p>{{ $t("instruks.p3.tekst1") }}</p>
    <p>{{ $t("instruks.p3.tekst2") }}</p>
    <p>{{ $t("instruks.p3.tekst3") }}</p>
    <h2 class="text-subtitle-1 font-weight-bold mt-4">
      {{ $t("instruks.adjektiv.tittel") }}
    </h2>
    <ul>
      <li>
        {{ $t("instruks.adjektiv.punkt1") }}
        <p>
          behagelig ->
          <v-icon size="small" color="green"> mdi-checkbox-marked-circle </v-icon>
          快適な <v-icon small color="red"> mdi-close-circle </v-icon> 快適
        </p>
      </li>
      <li>
        {{ $t("instruks.adjektiv.punkt2") }}
        <p>
          lei ->
          <v-icon size="small" color="green"> mdi-checkbox-marked-circle </v-icon>
          飽きた <v-icon small color="red"> mdi-close-circle </v-icon> 飽きる
        </p>
      </li>
      <li>
        {{ $t("instruks.adjektiv.punkt3") }}
        <p>
          aktuell ->
          <v-icon size="small" color="green"> mdi-checkbox-marked-circle </v-icon>
          実際の、見込みのある
          <v-icon size="small" color="red"> mdi-close-circle </v-icon> 実際、見込み
        </p>
      </li>
    </ul>
    <h2 class="text-subtitle-1 font-weight-bold mt-4">
      {{ $t("instruks.adverb.tittel") }}
    </h2>
    <ul>
      <li>
        {{ $t("instruks.adverb.punkt1") }}
        <p>
          likevel ->
          <v-icon size="small" color="green"> mdi-checkbox-marked-circle </v-icon>
          それでも、それにもかかわらず
        </p>
      </li>

      <li>
        {{ $t("instruks.adverb.punkt2") }}
        <p>
          framme ->
          <v-icon size="small" color="green"> mdi-checkbox-marked-circle </v-icon>
          前方に・で
          <v-icon size="small" color="red"> mdi-close-circle </v-icon> 前方
        </p>
      </li>
    </ul>
    <h2 class="text-subtitle-1 font-weight-bold mt-4">
      {{ $t("instruks.substantiv.tittel") }}
    </h2>
    <ul>
      <li>
        {{ $t("instruks.substantiv.punkt1") }}
        <p>
          billett ->
          <v-icon size="small" color="green"> mdi-checkbox-marked-circle </v-icon>
          切符、チケット、入場券
        </p>
      </li>
      <li>
        {{ $t("instruks.substantiv.punkt2") }}
        <p>
          einstape ->
          <v-icon size="small" color="green"> mdi-checkbox-marked-circle </v-icon>
          ワラビ <v-icon small color="red"> mdi-close-circle </v-icon> 蕨
        </p>
      </li>
    </ul>
    <h2 class="text-subtitle-1 font-weight-bold mt-4">
      {{ $t("instruks.verb.tittel") }}
    </h2>
    <ul>
      <li>
        {{ $t("instruks.verb.punkt1") }}
        spise ->
        <v-icon size="small" color="green"> mdi-checkbox-marked-circle </v-icon>
        食べる
        <v-icon size="small" color="red"> mdi-close-circle </v-icon>
        食べた・食べ・食べている
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "instruks-boks",
  data() {
    return {};
  },
});
</script>

<style scoped>
p {
  margin-bottom: 12px;
}
ul {
  list-style-position: outside;
  padding-left: 1.5em;
}
</style>
