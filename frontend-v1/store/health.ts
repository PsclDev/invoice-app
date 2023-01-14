import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { $axios } from '~/utils/axios';

@Module({
  name: 'health',
  stateFactory: true,
  namespaced: false,
})
export default class HealthModule extends VuexModule {
  readonly PREFIX: string = '/health';

  apiVersion: string = '';
  apiRunning: boolean = false;
  dbConnected: boolean = false;

  get ApiRunning() {
    return this.apiRunning;
  }

  get DbConnected() {
    return this.dbConnected;
  }

  @Mutation
  setHealth(health: {
    apiVersion: string;
    apiRunning: boolean;
    dbConnected: boolean;
  }) {
    this.apiVersion = health.apiVersion;
    this.apiRunning = health.apiRunning;
    this.dbConnected = health.dbConnected;
  }

  @Action({ commit: 'setHealth', rawError: true })
  async getHealth(): Promise<{
    apiVersion: string;
    apiRunning: boolean;
    dbConnected: boolean;
  }> {
    try {
      const res = await $axios.$get(this.PREFIX);
      const apiVersion = res.version;
      const apiRunning = res.details.api.status === 'up';
      const dbConnected = res.details.database.status === 'up';

      return { apiVersion, apiRunning, dbConnected };
    } catch {
      return { apiVersion: '', apiRunning: false, dbConnected: false };
    }
  }
}
