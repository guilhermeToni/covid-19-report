<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      bordered
      class="bg-white">
      <q-toolbar class="text-primary">
        <q-toolbar-title>
          <q-icon name="fa fa-virus-covid" />
          <span class="text-body2 q-ml-sm">Covid-19 Report</span>
        </q-toolbar-title>

        <q-space />

        <p class="q-mb-none">
          <span class="q-mr-sm text-black">Status da API</span>
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
