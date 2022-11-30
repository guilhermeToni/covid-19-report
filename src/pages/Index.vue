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
            @input="searchByDate">
            <template v-slot:append>
              <q-icon name="event" />
            </template>
          </q-input>
        </div>
      </div>

      <template v-if="showCountryCardInfo">
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

        <template>
          <div
            v-if="currentCountry === 'Brazil'"
            class="row col-12 q-mt-md q-col-gutter-sm">

            <q-separator class="q-mb-md col-10 offset-1" />

            <div class="row col-12 justify-between">
              <p class="col-12 col-sm-grow text-h5 col-grow q-mb-xs text-weight-bold">
                Estados Brasileiros
              </p>

              <div class="row col-12 col-sm-shrink items-center">
                <span class="col-shrink q-pr-sm q-pb-xs text-weight-bold">
                  Ordenar por:
                </span>

                <div style="min-width: 110px">
                  <div class="col-shrink">
                    <q-select
                      borderless
                      dense
                      hide-bottom-space
                      behavior="menu"
                      class="col"
                      :disable="loadingData"
                      :emit-value="false"
                      :options="sortOptions"
                      :value="getCurrentSort"
                      @input="sortStatesByParam" />
                  </div>
                </div>
              </div>
            </div>
            <div
              v-for="state in covidData.allStateData"
              class="state-info col-12 col-sm-6 col-md-4 row"
              :key="state.uid">
              <Card
                :key="state.uid"
                :data="state" />
            </div>
          </div>
        </template>
      </template>

      <template v-else-if="!loadingData && currentState">
        <div class="row col-12 q-col-gutter-sm q-mb-md">

          <q-separator class="q-mb-xl col-10 offset-1" />

          <div class="single-state-info col-12 col-sm-6 col-md-4 row">
            <Card
              showUpdateAt
              :data="stateInfo" />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="col-12 row">
          <CardLoading class="q-mb-md" />
          <div class="col-12 row q-col-gutter-sm">
            <ChartBarLoading class="col-12 col-md-6" />
            <ChartBarLoading class="col-12 col-md-6" />
          </div>
        </div>
      </template>
    </div>

    <q-page-sticky
      v-show="showBackToTopButton"
      position="bottom-right"
      :offset="[18, 18]">
      <q-btn
        dense
        fab
        color="primary"
        icon="keyboard_arrow_up"
        @click="scrollToTop" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { scroll } from 'quasar';
import { isNull, isEmpty, hasIn } from 'lodash';
import dayjs from 'dayjs';

import { CountryCard, Card } from 'components/general/Card';
import { ChartBar } from 'components/composite/ChartBar';
import { CardLoading, ChartBarLoading } from 'components/general/Loading';

const { getScrollTarget, animScrollTo } = scroll;

export default {
  name: 'PageIndex',

  components: {
    CountryCard,
    ChartBar,
    Card,
    CardLoading,
    ChartBarLoading,
  },

  data() {
    return {
      showBackToTopButton: false,
      targetScrollY: 500,

      covidData: {},

      countryInfo: {},
      stateInfo: {},

      loadingData: false,

      currentState: null,
      currentCountry: null,

      dateToSearch: '',

      stateOptions: [],
      savedStateOptions: [],

      countriesOptions: [],
      savedCountriesOptions: [],

      chartData: {},

      currentSort: 'moreCases',
      sortOptions: [
        { label: 'Mais casos confirmados', value: 'moreCases' },
        { label: 'Mais mortes', value: 'moreDeaths' },
        { label: 'Menos casos confirmados', value: 'lessCases' },
        { label: 'Menos mortes', value: 'lessDeaths' },
      ],
    };
  },

  computed: {
    isMobile() {
      return this.$q.screen.lt.md;
    },

    showCountryCardInfo() {
      return !this.loadingData && isEmpty(this.currentState);
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

    getCurrentSort() {
      const { currentSort = '', sortOptions = [] } = this;

      const { label = '' } = sortOptions.find(item => item.value === currentSort);

      return label;
    },
  },

  async mounted() {
    document.addEventListener('scroll', () => this.eventScroll());

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
     * @description Check scrollY from page
     */
    eventScroll() {
      this.showBackToTopButton = window.scrollY >= this.targetScrollY;
    },

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @description Scroll to top
     */
    scrollToTop() {
      const elElement = document.querySelector('.q-page');
      const scrollTop = window.scrollY + elElement
        .getBoundingClientRect()
        .top;
      const elElementToScroll = getScrollTarget(elElement);
      const duration = 800;
      const offset = 70;
      animScrollTo(elElementToScroll, scrollTop - offset, duration);
    },

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
      const { dateToSearch: date } = this;

      const data = await this.getCountryReport({ date });

      if (isEmpty(data)) {
        this.$q.notify({
          message: 'Não há nenhum registro para a data informada',
          color: 'red',
        });
        return;
      }

      this.covidData = {
        ...this.covidData,
        allStateData: data,
      };

      this.mountChart();
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

    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @description Sorting brazilian states by sorting type
     *
     * @param {object} item - Current selected option in sorting select
     * @param {string} item.value - Current selected value
     * @param {string} item.label - Current selected label
     */
    sortStatesByParam(item) {
      const { value: order } = item;

      this.sorting = { ...item };
      this.changeSorting(order);
    },

    /**
     * @author Thiago Anselmo <thiagoo.anselmoo@gmail.com>
     *
     * @description Change the current brazilian state report sorting
     *
     * @param {string} sortOrder
     */
    changeSorting(sortOrder) {
      if (sortOrder === this.currentSort) return;

      try {
        const { covidData } = this;
        const { allStateData } = covidData;

        const sortType = {
          moreCases: () => this.sortByCases(allStateData),
          moreDeaths: () => this.sortByDeaths(allStateData),
          lessCases: () => this.sortByCases(allStateData, 'less'),
          lessDeaths: () => this.sortByDeaths(allStateData, 'less'),
          nop: () => console.error(`Sort ${sortOrder} not allow`),
        };

        if (hasIn(sortType, sortOrder)) sortType[sortOrder]();
        else sortType.nop();

        this.currentSort = sortOrder;
      } catch (ex) {
        console.error(ex);
      }
    },

    /**
     * @author Thiago Anselmo <thiagoo.anselmoo@gmail.com>
     *
     * @description Apply sort by cases on states
     *
     * @param {array} data - all states
     * @param {string} comparison=more - comparison type
     */
    sortByCases(data, comparison = 'more') {
      let sortedData = [];
      sortedData = data
        .sort((a, b) => {
          if (a.cases < b.cases) return 1;
          if (a.cases > b.cases) return -1;

          return 0;
        });

      if (comparison === 'less') {
        sortedData = sortedData.reverse();
      }

      this.covidData = {
        ...this.covidData,
        allStateData: sortedData,
      };
    },

    /**
     * @author Thiago Anselmo <thiagoo.anselmoo@gmail.com>
     *
     * @description Apply sort by deaths on states
     *
     * @param {array} data - all states
     * @param {string} comparison=more - comparison type
     */
    sortByDeaths(data, comparison = 'more') {
      let sortedData = [];

      sortedData = data
        .sort((a, b) => {
          if (a.deaths < b.deaths) return 1;
          if (a.deaths > b.deaths) return -1;

          return 0;
        });

      if (comparison === 'less') {
        sortedData = sortedData.reverse();
      }

      this.covidData = {
        ...this.covidData,
        allStateData: sortedData,
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
