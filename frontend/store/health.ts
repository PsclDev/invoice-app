import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { $axios } from '~/utils/axios';

@Module({
  name: 'health',
  stateFactory: true,
  namespaced: false,
})
export default class HealthModule extends VuexModule {
  readonly PREFIX: string = '/health';

  apiRunning: boolean = false;
  dbConnected: boolean = false;

  get ApiRunning() {
    return this.apiRunning;
  }

  get DbConnected() {
    return this.dbConnected;
  }

  @Mutation
  setHealth(health: { apiRunning: boolean, dbConnected:boolean }) {
    this.apiRunning = health.apiRunning;
    this.dbConnected = health.dbConnected;
  }

  @Action({ commit: 'setHealth', rawError: true })
  async getHealth(): Promise<{ apiRunning: boolean, dbConnected: boolean }> {
    try {
      const res = await $axios.$get(this.PREFIX);
      const apiRunning = res.details.api.status === 'up';
      const dbConnected = res.details.database.status === 'up';
      
      return { apiRunning, dbConnected};
    } catch {
      return { apiRunning: false, dbConnected: false};
    }
  }
}
