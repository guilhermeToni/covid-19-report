<template>
  <q-page class="full-width q-py-lg q-px-md">
    <div class="row justify-center container">
      <template v-if="!loadingData">
        <div class="row col-12 q-col-gutter-sm q-mb-md justify-between">
          <div class="country-info col-12 col-md-12 row q-mb-md">
            <CountryCard :data="covidData.countryData" />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="col-12 row">
          <p class="col-12 text-center">Aguarde...</p>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script>
import { CountryCard } from 'components/general/Card';

export default {
  name: 'PageIndex',

  components: {
    CountryCard,
  },

  data() {
    return {
      covidData: {},

      loadingData: false,

      currentCountry: null,
    };
  },

  computed: {
    isMobile() {
      return this.$q.screen.lt.md;
    },
  },

  async mounted() {
    this.loadingData = true;

    const getCountryReportPromise = this.getCountryReport();

    const [countryData] = await Promise.all([getCountryReportPromise]);

    this.covidData = { countryData };
    this.loadingData = false;
  },

  methods: {
    async getCountryReport(params = {}) {
      const { currentCountry: country } = this;

      return this
        .$services
        .covidApiV1
        .country
        .getByCountry({ country: country || 'Brazil', ...params });
    },
  },
};
</script>

<style lang="scss">
.container {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
}
</style>
