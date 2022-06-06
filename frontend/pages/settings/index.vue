<template>
  <div class="row">
    <div class="col-8 col-md-6 mb-2 p-0">
      <AppSearch :settings="store.Settings" @filtered="onFilterChanged" />
    </div>
    <div class="mt-5 col-12">
      <div v-if="isLoading" class="text-center">
        <AppSpinner />
      </div>
      <div v-else>
        <template v-for="key in Object.keys(SettingType)">
          <SettingContainer
            v-if="settings.filter((s) => s.type === key).length > 0"
            :key="key"
            :type="key"
            :settings="settings.filter((s) => s.type === key)"
            class="mb-2"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import SettingModule from '~/store/setting';
import { Setting } from '~/models';
import { SettingType } from '~/types';

export default Vue.extend({
  name: 'SettingssPage',
  data() {
    return {
      SettingType,
      store: getModule(SettingModule, this.$store),
      filteredList: [] as Setting[],
      isLoading: false,
    };
  },
  computed: {
    settings(): Setting[] {
      return this.filteredList;
    },
    mailSettings(): Setting[] {
      return this.settings.filter((s) => s.type === SettingType.MAIL);
    },
    pdfSettings(): Setting[] {
      return this.settings.filter((s) => s.type === SettingType.PDF);
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
    onFilterChanged(filteredList: Setting[]) {
      this.filteredList = filteredList;
    },
  },
});
</script>
