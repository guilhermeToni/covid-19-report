<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      bordered
      class="bg-white">
      <q-toolbar class="text-primary">
        <q-toolbar-title :class="isMobile ? 'col-12 text-center' : ''">
          <q-icon name="fa fa-virus-covid" />
          <span class="text-body2 q-ml-sm">Covid-19 Report</span>
        </q-toolbar-title>

        <q-space />

        <p
          v-show="!isMobile"
          class="q-mb-none">
          <span
            class="q-mr-sm text-black">Status da API</span>
          <q-badge
            class="q-pa-sm"
            :color="apiStatus.color"
            :text-color="apiStatus.textColor">
            {{ apiStatus.label }}
          </q-badge>
        </p>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      bordered
      class="bg-white">
      <q-toolbar class="text-primary">
        <p class="q-mb-none">
          <q-icon name="fa fa-virus-covid" />
          <span class="text-body2 q-ml-sm">Covid-19 Report</span>
        </p>

        <q-space />

        <p class="q-mb-none text-caption text-weight-500">Made by
          <a
            class="footer-link"
            href="github.com/guilhermeToni/covid-19-report"
            target="_blank"
            >Guilherme Toni</a>
        </p>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',

  data() {
    return {
      apiStatus: {
        color: '',
        label: '',
        textColor: '',
      },
    };
  },
  computed: {
    isMobile() {
      return this.$q.screen.lt.md;
    },
  },

  async mounted() {
    await this.getApiStatus();
  },

  methods: {
    /**
     * @author Guilherme Toni <guilhermedelly8@gmail.com>
     *
     * @async
     * @description Get covid-19 api status
     */
    async getApiStatus() {
      const { status } = await this
        .$services
        .covidApiV1
        .general
        .getApiStatus();

      const color = status === 'ok' ? 'green' : 'yellow';
      const textColor = status === 'ok' ? 'white' : 'black';
      const label = status === 'ok' ? 'Conectado' : 'Sem conexão';

      this.apiStatus = {
        color,
        label,
        textColor,
      };
    },
  },
};
</script>

<style>
.footer-link {
  font-weight: 600;
  text-decoration: none;
}
</style>
