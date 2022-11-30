<template>
  <div
    class="country-info__card row col-12 content-start"
    :style="countryInfo.flag
      ? `background-image: url(${countryInfo.flag}); background-size: 0;`
      : 'none'">
    <span class="col-12 text-h2 q-mb-lg">{{ countryInfo.country }}</span>

    <span class="col-12 text-h5 q-mt-lg">{{ countryInfo.confirmed }}</span>
    <span class="col-12 text-weight-bold q-mb-lg">Casos confirmados</span>

    <span class="col-12 text-h5 q-mt-lg">{{ countryInfo.deaths }}</span>
    <span class="col-12 text-weight-bold q-mb-lg">Mortes</span>

    <span class="col-12 text-caption q-mt-lg">
      Atualizado em {{ countryInfo.updatedAt }}
    </span>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { formatNumber } from 'src/tools';

export default {
  name: 'CountryCard',

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  computed: {
    countryInfo() {
      const { data = {} } = this;
      const { country = '' } = data;

      let {
        confirmed = 0,
        deaths = 0,
        updated_at: updatedAt,
      } = data;

      confirmed = formatNumber(confirmed);
      deaths = formatNumber(deaths);
      updatedAt = dayjs(updatedAt).format('DD/MM/YYYY HH:mm:ss');

      const flag = country.toLowerCase() === 'brazil'
        ? './bandeiraBrasil.jpg'
        : '';

      return {
        country,
        confirmed,
        deaths,
        updatedAt,
        flag,
      };
    },
  },
};
</script>

<style lang="scss">
.country {
  &-info {
    height: 200px;

    &__card {
      position: relative;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 16px;
      overflow: hidden;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        opacity: .1;
        background-image: inherit;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: left center;
      }
    }
  }
}
</style>
