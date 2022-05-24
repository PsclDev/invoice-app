<template>
  <div class="container">
    <div class="row">
      <h1>Dashboard</h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import StatisticsModule from '~/store/statistics';

export default Vue.extend({
  name: 'DashboardPage',
  data() {
    return {
      store: getModule(StatisticsModule, this.$store),
      isLoading: false,
    };
  },
  computed: {},
  mounted() {
    this.getStatistics();
  },
  methods: {
    async getStatistics() {
      this.isLoading = true;
      await this.store.getStatistics();
      this.isLoading = false;
    },
  },
});
</script>
