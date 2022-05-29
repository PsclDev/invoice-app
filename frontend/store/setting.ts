import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { Setting } from '~/models';
import { SettingType } from '~/types';
import { $axios } from '~/utils/axios';

@Module({
  name: 'setting',
  stateFactory: true,
  namespaced: false,
})
export default class SettingModule extends VuexModule {
  readonly VERSION: string = '/v1';
  readonly PREFIX: string = `${this.VERSION}/setting`;
  settings: Array<Setting> = [];

  get Settings() {
    return this.settings;
  }

  @Mutation
  setSettings(settings: Setting[]) {
    this.settings = settings;
  }

  @Mutation
  setSetting(setting: Setting) {
    const settings = this.settings.filter(
      (c) => c.id !== setting.id && c.id !== undefined
    );

    settings.push(setting);
    this.settings = settings;
  }

  @Mutation
  newSetting(setting: Setting) {
    this.settings.unshift(setting);
  }

  @Mutation
  delSetting(settingId: string) {
    const settings = this.settings.filter((c) => c.id !== settingId);
    this.settings = settings;
  }

  @Action({ commit: 'setSettings', rawError: true })
  async getSettings(): Promise<Setting[]> {
    return await $axios.$get(this.PREFIX);
  }

  @Action({ commit: 'newSetting', rawError: true })
  createLocalSetting(type: SettingType): Setting {
    return {
      id: '1',
      type,
      key: '',
      value: '',
    } as Setting;
  }

  @Action({ commit: 'setSetting', rawError: true })
  async createSetting(setting: Setting): Promise<Setting> {
    return await $axios.$post(`${this.PREFIX}`, setting);
  }

  @Action({ commit: 'setSetting', rawError: true })
  async updateSetting(setting: Setting): Promise<Setting> {
    await $axios.$patch(`${this.PREFIX}/${setting.id}`, setting);
    return setting;
  }

  @Action({ commit: 'delSetting', rawError: true })
  async deleteSetting(setting: Setting): Promise<string> {
    return await $axios.$delete(`${this.PREFIX}/${setting.id}`);
  }
}
