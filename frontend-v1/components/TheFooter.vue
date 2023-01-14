<template>
  <footer class="footer fixed-bottom pb-2">
    <div class="d-flex justify-content-center gap-5">
      <div
        class="tooltip-top tooltip-mobile"
        :data-tooltip="`App Version: ${appVersion}`"
      >
        {{ $tc('footer.last_checked') }}:
        {{ getDate(lastChecked.toString(), DateTimeFormat.TIME) }}
      </div>
      <div
        :class="apiRunning ? 'connected' : 'disconnected'"
        class="tooltip-top tooltip-mobile"
        :data-tooltip="`Api: ${apiVersion}`"
      >
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
      apiVersion: '',
      apiRunning: false,
      dbConnected: false,
    };
  },
  computed: {
    appVersion(): string {
      return this.$config.appVersion;
    },
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
      this.apiVersion = this.store.apiVersion;
      this.apiRunning = this.store.apiRunning;
      this.dbConnected = this.store.dbConnected;
    },
  },
});
</script>

<style lang="scss" scoped>
footer {
  font-size: 0.75rem;
  background-color: $primary-background;
}

.connected {
  color: $green;
}

.disconnected {
  color: $red;
}

[data-tooltip] {
  $triangle: 0.3rem;
  $background-color: rgba(51, 51, 51, 0.9);

  cursor: pointer;
  display: inline-block;
  position: relative;

  &::after {
    background-color: $background-color;
    border-radius: $triangle;
    color: #fff;
    content: attr(data-tooltip);
    font-size: 1rem;
    font-size: 85%;
    font-weight: normal;
    line-height: 1.15rem;
    opacity: 0;
    padding: 0.25rem 0.5rem;
    position: absolute;
    text-align: center;
    text-transform: none;
    transition: opacity 0.2s;
    visibility: hidden;
    white-space: nowrap;
    z-index: 1;
  }

  &.tooltip-top {
    // arrows
    &::before {
      border-style: solid;
      border-width: $triangle;
      content: '';
      opacity: 0;
      position: absolute;
      transition: opacity 0.2s;
      visibility: hidden;
      border-color: $background-color transparent transparent transparent;
      top: 0;
      left: 50%;
      margin-left: -$triangle;
    }

    &::after {
      bottom: 100%;
      left: 50%;
      transform: translate(-50%);
    }
  }

  &.tooltip-mobile {
    @media (max-width: 767px) {
      &::before {
        display: none;
      }

      &:after {
        font-size: 1rem;
        max-width: 20rem;
        position: fixed;
        bottom: auto;
        top: 50%;
        left: 50%;
        text-align: left;
        transform: translate(-50%);
        white-space: normal;
      }
    }
  }

  &:hover::after,
  &[class*='tooltip-']:hover::before {
    visibility: visible;
    opacity: 1;
  }
}
</style>
