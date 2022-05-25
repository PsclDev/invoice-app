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
      <button class="col-6 btn btn-link" @click="save">
        <font-awesome-icon :icon="['fas', 'save']" />
      </button>
      <button class="col-6 btn btn-link" @click="remove">
        <font-awesome-icon :icon="['fas', 'trash']" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import { Setting } from '~/models/setting';
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
      mutableSetting: {} as Setting,
    };
  },
  watch: {
    value() {
      this.setSetting();
    },
  },
  methods: {
    setSetting() {
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
