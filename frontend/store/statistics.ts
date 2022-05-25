import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { Statistics } from '~/models/statistics';
import { $axios } from '~/utils/axios';

@Module({
  name: 'statistics',
  stateFactory: true,
  namespaced: false,
})
export default class StatisticsModule extends VuexModule {
  readonly VERSION: string = '/v1';
  readonly PREFIX: string = `${this.VERSION}/statistics`;

  statistics!: Statistics;

  get Statistics() {
    return this.statistics;
  }

  @Mutation
  setStatistics(stats: Statistics) {
    this.statistics = stats;
  }

  @Action({ commit: 'setStatistics', rawError: true })
  async getStatistics(): Promise<Statistics> {
    return await $axios.$get(this.PREFIX);
  }
}
