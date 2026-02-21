<template>
  <v-container>
    <v-row justify="center">
      <v-col md="7" sm="10" cols="12">
        <div class="text-body-2 border-thin pa-4">
          <h1 class="text-title">
            {{ $t("om.hovedtittel") }}
          </h1>
          <h2 class="text-subtitle-1 font-weight-bold mt-4">
            {{ $t("om.p1.tittel") }}
          </h2>
          <p>{{ $t("om.p1.tekst") }}</p>

          <h2 class="text-subtitle-1 font-weight-bold mt-4">
            {{ $t("om.p2.tittel") }}
          </h2>
          <p>
            {{ $t("om.p2.tekst") }}
          </p>

          <h2 class="text-subtitle-1 font-weight-bold mt-4">
            {{ $t("om.p3.tittel") }}
          </h2>
          <p>
            {{ $t("om.p3.tekst") }}
          </p>
          <ol>
            <li>
              <router-link to="/registrer">{{
                $t("om.p3.liste.1")
              }}</router-link>
            </li>
            <li>
              <router-link to="/logginn">{{ $t("om.p3.liste.2") }}</router-link>
            </li>
            <li>
              {{ $t("om.p3.liste.31")
              }}<router-link to="/instruks">{{
                $t("om.p3.liste.32")
              }}</router-link
              >{{ $t("om.p3.liste.33") }}
            </li>
            <li>{{ $t("om.p3.liste.4") }}</li>
            <li>{{ $t("om.p3.liste.5") }}</li>
            <li>{{ $t("om.p3.liste.6") }}</li>
          </ol>
          <h2 class="text-subtitle-1 font-weight-bold mt-4">
            {{ $t("om.p4.tittel") }}
          </h2>
          <p>{{ $t("om.p4.tekst1") }}</p>
          <p>{{ $t("om.p4.tekst2") }}</p>
          <h2 class="text-subtitle-1 font-weight-bold mt-4">
            {{ $t("om.p5.tittel") }}
          </h2>
          <p v-html="$t('om.p5.tekst')"></p>
          <h2 class="text-subtitle-1 font-weight-bold mt-4">
            {{ $t("om.p6.tittel") }}
          </h2>
          <p>{{ $t("om.p6.tekst") }}</p>
          <p v-html="$t('om.p6.liste')"></p>
          <p>{{ $t("om.p6.kontakt") }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "om",

  data() {
    return {};
  },

  methods: {},

  mounted() {},
});
</script>

<style scoped>
ol,
::v-deep ul {
  list-style-position: outside;
  padding-left: 1.5em; /* or more depending on design */
}
</style>
