<template>
  <footer class="footer fixed-bottom pb-2">
    <div class="d-flex justify-content-center gap-5">
      <div>
        {{ $tc('footer.last_checked') }}:
        {{ getDate(lastChecked.toString(), DateTimeFormat.TIME) }}
      </div>
      <div :class="apiRunning ? 'connected' : 'disconnected'">
        <font-awesome-icon :icon="['fas', 'server']" />
      </div>
      <div :class="dbConnected ? 'connected' : 'disconnected'">
        <font-awesome-icon :icon="['fas', 'database']" />
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import HealthModule from '~/store/health';
import { getDate } from '~/utils/helper';
import { DateTimeFormat } from '~/types';

export default Vue.extend({
  name: 'TheFooter',
  data() {
    return {
      DateTimeFormat,
      getDate,
      store: getModule(HealthModule, this.$store),
      lastChecked: new Date(),
      apiRunning: false,
      dbConnected: false,
    };
  },
  mounted() {
    this.getHealth();

    window.setInterval(() => {
      this.getHealth();
    }, 90000);
  },
  methods: {
    async getHealth() {
      this.lastChecked = new Date();
      await this.store.getHealth();
      this.apiRunning = this.store.apiRunning;
      this.dbConnected = this.store.dbConnected;
    },
  },
});
</script>

<style lang="scss" scoped>
footer {
  background-color: $primary-background;
}

.connected {
  color: $green;
}

.disconnected {
  color: $red;
}
</style>
