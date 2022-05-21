<template>
  <div class="row">
    <div class="col-8 col-md-6 mb-2">
      <AppSearch :clients="store.Clients" @filtered="onFilterChanged" />
    </div>
    <div class="col text-center">
      <button
        class="col-8 col-md-6 btn btn-primary px-5 font-weight-bold"
        @click="create"
      >
        {{ $t('settings.create') }}
      </button>
    </div>
    <div class="mt-5 col-12">
      <div v-if="isLoading" class="text-center">
        <AppSpinner />
      </div>
      <div v-else>
        <h1>Todo</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import SettingModule from '~/store/setting';
import { Setting } from '~/models/setting';

export default Vue.extend({
  name: 'SettingssPage',
  data() {
    return {
      store: getModule(SettingModule, this.$store),
      filteredList: [] as Setting[],
      isLoading: false,
    };
  },
  computed: {
    settings(): Setting[] {
      return this.filteredList;
    },
  },
  watch: {
    'store.Settings'() {
      this.filteredList = this.store.Settings;
    },
  },
  mounted() {
    this.getSettings();
  },
  methods: {
    async getSettings() {
      this.isLoading = true;
      await this.store.getSettings();
      this.isLoading = false;
    },
    create() {
      //   #TODO
    },
    onFilterChanged(filteredList: Setting[]) {
      this.filteredList = filteredList;
    },
  },
});
</script>
