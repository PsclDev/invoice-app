<template>
  <AppCollapse>
    <template #header>
      <slot name="header">{{
        $t(`enums.setting_type.${type.toLowerCase()}`)
      }}</slot>
    </template>
    <template #body>
      <div class="container">
        <SettingForm
          v-for="setting of settings"
          :key="setting.id"
          :value="mutableSetting(setting)"
          :view-mode="ViewMode.EDIT"
          class="mb-2"
        ></SettingForm>
        <div class="col-10 text-center p-2 add" @click="add">
          <font-awesome-icon :icon="['fas', 'plus']" />
        </div>
      </div>
    </template>
  </AppCollapse>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import { Setting } from '~/models';
import SettingModule from '~/store/setting';
import { SettingType, ViewMode } from '~/types';
import { getMutableSetting } from '~/utils/helper';

export default Vue.extend({
  name: 'SettingContainerComponent',
  props: {
    type: {
      type: String as () => SettingType,
      required: true,
    },
    settings: {
      type: Array as () => Setting[],
      required: true,
    },
  },
  data() {
    return {
      ViewMode,
      store: getModule(SettingModule, this.$store),
    };
  },
  methods: {
    mutableSetting(setting: Setting): Setting {
      return getMutableSetting(setting);
    },
    add() {
      this.store.createLocalSetting(this.type);
    },
  },
});
</script>

<style lang="scss" scoped>
.add {
  cursor: pointer;
  border-radius: 10px;
  background-color: $tertiary-background;
}
</style>
