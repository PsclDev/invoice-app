<template>
  <div class="row mb-4">
    <App-Input
      v-model="mutableSetting.key"
      type="text"
      class="col-sm-5 mb-3 mb-sm-0"
      :title="$t('settings.key')"
      :hide-label="false"
      :view-mode="viewMode"
    ></App-Input>
    <App-Input
      v-model="mutableSetting.value"
      type="text"
      class="col-sm-5 mb-3 mb-sm-0"
      :title="$t('settings.value')"
      :hide-label="false"
      :view-mode="viewMode"
    ></App-Input>
    <div class="col-sm-2 d-flex actions gap-sm-2">
      <button class="col-6 btn btn-link" :disabled="!hasChanged" @click="save">
        <font-awesome-icon :icon="['fas', 'save']" />
      </button>
      <button
        class="col-6 btn btn-link"
        :disabled="!mutableSetting.deletable"
        @click="remove"
      >
        <font-awesome-icon :icon="['fas', 'trash']" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import { Setting } from '~/models';
import SettingModule from '~/store/setting';
import { ViewMode, SettingType } from '~/types';
import { getMutableSetting } from '~/utils/helper';

export default Vue.extend({
  name: 'SettingFormComponent',
  props: {
    value: {
      type: Object as () => Setting,
      required: true,
    },
    viewMode: {
      type: String as () => ViewMode,
      required: true,
    },
  },
  data() {
    return {
      ViewMode,
      SettingType,
      store: getModule(SettingModule, this.$store),
      shadowSetting: {} as Setting,
      mutableSetting: {} as Setting,
      hasChanged: false,
    };
  },
  watch: {
    value() {
      this.setSetting();
    },
    mutableSetting: {
      handler() {
        const equal =
          JSON.stringify(this.mutableSetting) ===
          JSON.stringify(this.shadowSetting);

        this.hasChanged = !equal;
      },
      deep: true,
    },
  },
  methods: {
    setSetting() {
      this.shadowSetting = getMutableSetting(this.value);
      this.mutableSetting = getMutableSetting(this.value);
    },
    info() {},
    save() {
      if (this.mutableSetting.id === '1')
        this.store.createSetting(this.mutableSetting);
      else this.store.updateSetting(this.mutableSetting);
    },
    remove() {
      this.store.deleteSetting(this.mutableSetting);
    },
  },
});
</script>

<style scoped>
.actions {
  align-items: flex-end;
  margin-bottom: 0.25rem;
}
</style>
