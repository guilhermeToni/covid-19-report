<template>
  <div class="loading-info__card row col-12">
    <div class="col-12 row">
      <q-skeleton type="rect" height="50px" class="q-mb-xl col-12 col-md-4" />
    </div>

    <div class="col-12 row">
      <q-skeleton type="rect" height="20px" class="q-mb-sm q-mt-lg col-12 col-md-3" />
    </div>
    <div class="col-12 row">
      <q-skeleton type="rect" height="10px" class="q-mb-xl col-md-3" />
    </div>

    <div class="col-12 row">
      <q-skeleton type="rect" height="20px" class="q-mt-lg q-mb-sm col-12 col-md-3" />
    </div>
    <div class="col-12 row">
      <q-skeleton type="rect" height="10px" class="q-mb-xl col-md-3" />
    </div>

    <div class="col-12 row">
      <q-skeleton type="rect" height="6px" class="col-2 col-md-2" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardLoading',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {};
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {},
};
</script>

<style lang="scss">
.loading {
  &-info__card {
    height:365px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 16px;
  }
}
</style>
