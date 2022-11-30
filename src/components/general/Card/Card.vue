<template>
  <div class="state-info__card row col">
    <span class="col-12 text-h5">{{ stateFormatted.state }}</span>

    <q-separator class="full-width q-my-md" />

    <span class="col-12 text-weight-bold">Casos confirmados</span>
    <span class="col-12 text-h6 q-mb-md">{{ stateFormatted.cases }}</span>

    <span class="col-12 text-weight-bold">Suspeitos</span>
    <span class="col-12 text-h6 q-mb-md">{{ stateFormatted.suspects }}</span>

    <span class="col-12 text-weight-bold">Mortes</span>
    <span class="col-12 text-h6 q-mb-md">{{ stateFormatted.deaths }}</span>

    <span class="col-12 text-weight-bold">Negativos</span>
    <span class="col-12 text-h6">{{ stateFormatted.refuses }}</span>

    <span v-if="showUpdateAt">
      Atualizado em {{ stateFormatted.updatedAt }}
    </span>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { formatNumber } from 'src/tools';

export default {
  name: 'Card',

  props: {
    data: {
      type: Object,
      required: true,
    },

    showUpdateAt: {
      type: Boolean,
      default: () => false,
    },
  },

  computed: {
    stateFormatted() {
      const { data = {} } = this;
      const { state = '', uf = '' } = data;

      let {
        cases = 0,
        deaths = 0,
        refuses = 0,
        suspects = 0,
        updated_at: updatedAt,
      } = data;

      cases = formatNumber(cases);
      deaths = formatNumber(deaths);
      refuses = formatNumber(refuses);
      suspects = formatNumber(suspects);
      updatedAt = dayjs(updatedAt).format('DD/MM/YYYY HH:mm:ss');

      return {
        state: `${state} - ${uf}`,
        cases,
        deaths,
        refuses,
        suspects,
        updatedAt,
      };
    },
  },
};
</script>

<style lang="scss">
.state {
  &-info {
    height: 380px!important;

    &__card {
      border-radius: 4px;
      border: 1px solid #ccc;
      padding: 16px;

      @media screen and (max-width: 1023px) {
        background: none!important;
      }
    }
  }
}
</style>
