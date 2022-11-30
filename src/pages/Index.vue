<template>
  <q-page class="full-width q-py-lg q-px-md">
    <div class="row justify-center container">
      <div class="row col-12 q-mb-xl q-col-gutter-sm">
        <div
          class="row col-12"
          :class="selectCountryClasses">
          <q-select
            v-model="currentCountry"
            emit-value
            hide-dropdown-icon
            outlined
            use-input
            behavior="menu"
            class="col"
            :debounce="500"
            label="Selecione um país"
            :disable="loadingData"
            :options="countriesOptions"
            @filter="filterCountry"
            @input="() => searchCountry()">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-select>
        </div>

        <div
          v-if="currentCountry === 'Brazil'"
          class="row col-12 col-md-6"
          :class="selectStateClasses">
          <q-select
            v-model="currentState"
            clearable
            hide-dropdown-icon
            outlined
            use-input
            behavior="menu"
            class="col"
            label="Selecione um estado"
            :debounce="500"
            :disable="loadingData"
            :display-value="showCurrentStateSelectedValue"
            :options="stateOptions"
            @filter="filterState"
            @input="searchState">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-select>
        </div>

        <div
          v-if="currentCountry === 'Brazil'"
          class="row col-12 col-md-3"
          :class="selectStateClasses">
          <q-input
            v-model="dateToSearch"
            clearable
            outlined
            no-error-icon
            behavior="menu"
            class="col"
            label="Selecione uma data"
            mask="##/##/####"
            :debounce="500"
            :disable="loadingData"
            :fill-input="false"
            :rules="dateRules"
            @input="searchByDate">
            <template v-slot:append>
              <q-icon name="event" />
            </template>
          </q-input>
        </div>
      </div>

      <template v-if="!loadingData">
        <div class="row col-12 q-col-gutter-sm q-mb-md justify-between">
          <div class="country-info col-12 col-md-12 row q-mb-md">
            <CountryCard :data="countryInfo" />
          </div>

          <template v-if="currentCountry === 'Brazil'">
            <div class="row col-12 col-md-6">
              <ChartBar
                class="col"
                id="chart-brazil-cases"
                :chartData="chartData.cases" />
            </div>

            <div class="row col-12 col-md-6">
              <ChartBar
                class="col"
                id="chart-brazil-deaths"
                :chartData="chartData.deaths" />
            </div>
          </template>
        </div>
      </template>

      <template v-else>
        <div class="col-12 row">
          <p class="col-12 text-center">Trazendo os dados...</p>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script>
import { isNull } from 'lodash';
import dayjs from 'dayjs';

import { CountryCard } from 'components/general/Card';
import { ChartBar } from 'components/composite/ChartBar';

export default {
  name: 'PageIndex',

  components: {
    CountryCard,
    ChartBar,
  },

  data() {
    return {
      covidData: {},

      countryInfo: {},

      loadingData: false,

      currentState: null,
      currentCountry: null,

      dateToSearch: '',

      stateOptions: [],
      savedStateOptions: [],

      countriesOptions: [],
      savedCountriesOptions: [],

      chartData: {},
    };
  },

  computed: {
    isMobile() {
      return this.$q.screen.lt.md;
    },

    showCurrentStateSelectedValue() {
      let { currentState = {} } = this;
      if (isNull(currentState)) currentState = {};

      const { label = '' } = currentState;

      return label;
    },

    selectCountryClasses() {
      const { currentCountry, isMobile } = this;
      const spacingClass = isMobile ? 'q-pt-sm' : 'q-pr-sm';

      return `col-md-${currentCountry === 'Brazil' ? '3' : '12'} ${spacingClass}`.trim();
    },

    selectStateClasses() {
      const { isMobile } = this;
      const spacingClass = isMobile ? 'q-pt-sm' : 'q-pl-sm';

      return spacingClass;
    },

    dateRules() {
      return [
        value => (value && dayjs(value).isValid()) || 'Informe uma data válida',
      ];
    },
  },

  async mounted() {
    this.loadingData = true;

    const getCountryReportPromise = this.getCountryReport();
    const getCountriesReportPromise = this.getAllCountriesReport();

    const getAllStateReportPromise = this.getAllStateReport();

    const [
      countryData,
      countriesData,
      allStateData,
    ] = await Promise.all([
      getCountryReportPromise,
      getCountriesReportPromise,

      getAllStateReportPromise,
    ]);

    this.covidData = {
      countryData,
      countriesData,
      allStateData,
    };

    this.mountCountrySelect(countriesData);
    this.mountStateSelect(allStateData);

    this.countryInfo = countryData;
    this.currentCountry = 'Brazil';
    this.dateToSearch = dayjs().format('DD/MM/YYYY');

    this.mountChart();

    this.loadingData = false;
  },

  methods: {
    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @async
     * @description Get country report numbers from covid19
     *
     * @param {object} params - params to get country report
     * @param {string|date} params.date - date to get country report
     */
    async getCountryReport(params = {}) {
      const { currentCountry: country } = this;

      // TODO: verify if data exist on store
      return this
        .$services
        .covidApiV1
        .country
        .getByCountry({ country: country || 'Brazil', ...params });
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @async
     * @description Get all countries report numbers from covid19
     */
    async getAllCountriesReport() {
      // TODO: set this data on store
      return this
        .$services
        .covidApiV1
        .country
        .getAllCountries();
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @async
     * @description Get all brazilian states report numbers from covid19
     */
    async getAllStateReport() {
      // TODO: set this data on store
      return this
        .$services
        .covidApiV1
        .state
        .getAll();
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @async
     * @description Get brazilian state report numbers from covid19 by state
     *
     * @param {string} state - state uf
     */
    async getSingleStateReport(state) {
      // TODO: verify if data exist on store
      return this
        .$services
        .covidApiV1
        .state
        .getByState({ state });
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @description Mount state data to show on select options
     *
     * @param {array} states - States data
     */
    mountStateSelect(states) {
      let stateOptions = states.map((item) => {
        const { uf, state } = item;

        return {
          value: uf.toLowerCase(),
          label: state,
        };
      });

      stateOptions = stateOptions.sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;

        return 0;
      });

      this.savedStateOptions = stateOptions;
      this.stateOptions = stateOptions;
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @description Mount country data to show on select options
     *
     * @param {array} countries - Countries data
     */
    mountCountrySelect(countries) {
      countries = countries.flat();

      const countriesOptions = countries.map((item) => (item.country));

      this.savedCountriesOptions = countriesOptions;
      this.countriesOptions = countriesOptions;
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @async
     * @description Search state data by current state selected on search
     */
    async searchState() {
      const { currentState = {} } = this;
      if (isNull(currentState)) return;

      const { value = '' } = currentState;

      if (!value) return;

      this.loadingData = true;
      const singleStateData = await this.getSingleStateReport(value);
      this.covidData = {
        ...this.covidData,
        singleStateData,
      };

      this.stateInfo = { ...singleStateData };
      this.loadingData = false;
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @async
     * @description Search country data by current country selected on search
     *
     * @param {object} params - params to search country
     */
    async searchCountry(params = {}) {
      this.loadingData = true;
      const countryData = await this.getCountryReport(params);

      if (this.currentCountry !== 'Brazil') {
        this.covidData = {
          ...this.covidData,
          singleStateData: {},
        };

        this.dateToSearch = '';
        this.currentState = null;
        this.stateInfo = {};
      }

      this.covidData = {
        ...this.covidData,
        countryData,
      };

      this.countryInfo = countryData;
      this.loadingData = false;
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @async
     * @description Search brazilian state reports from a specific date
     */
    async searchByDate() {
      // const { dateToSearch: date } = this;
      // await this.getCountryReport({ date });

      // this.mountData();
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @description Filter country select options
     *
     * @param {string} value - search value
     * @param {function} update - function to update options value
     */
    filterCountry(value, update) {
      if (value === '') {
        update(() => {
          this.countriesOptions = this.savedCountriesOptions;
        });
        return;
      }

      update(() => {
        const needle = value.toLowerCase();
        this.countriesOptions = this
          .savedCountriesOptions
          .filter(option => option.toLowerCase().indexOf(needle) > -1);
      });
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @description Filter state select options
     *
     * @param {string} value - search value
     * @param {function} update - function to update options value
     */
    filterState(value, update) {
      if (value === '') {
        update(() => {
          this.stateOptions = this.savedStateOptions;
        });
        return;
      }

      update(() => {
        const needle = value.toLowerCase();
        this.stateOptions = this
          .savedStateOptions
          .filter(({ label: optionLabel }) => optionLabel.toLowerCase().indexOf(needle) > -1);
      });
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @description Mount brazilian state reports in a chart data
     */
    mountChart() {
      const { covidData = {} } = this;
      const { allStateData = [] } = covidData;

      const dataFromChart = allStateData.reduce((statesAndCases, currentData) => {
        const {
          state,
          cases,
          deaths,
        } = currentData;

        return {
          cases: {
            ...statesAndCases.cases,
            [state]: cases,
          },
          deaths: {
            ...statesAndCases.deaths,
            [state]: deaths,
          },
        };
      }, {});

      const confirmedCasesLabel = Object.keys(dataFromChart.cases);
      const confirmedCasesData = Object.values(dataFromChart.cases);

      const deathsCasesLabel = Object.keys(dataFromChart.deaths);
      const deathsCasesData = Object.values(dataFromChart.deaths);

      this.chartData = {
        deaths: {
          labels: deathsCasesLabel,
          datasets: [
            {
              label: 'Mortes por estado',
              backgroundColor: '#f00',
              data: deathsCasesData,
            },
          ],
        },
        cases: {
          labels: confirmedCasesLabel,
          datasets: [
            {
              label: 'Casos confirmados por estado',
              backgroundColor: '#1976d2',
              data: confirmedCasesData,
            },
          ],
        },
      };
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
