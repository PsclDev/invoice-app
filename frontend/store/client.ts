import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Client } from '~/types/client';
import { $axios } from '~/utils/axios';

@Module({
  name: "client",  
  stateFactory: true,
  namespaced: false
})
export default class ClientModule extends VuexModule {
  clients: Array<Client> = [];

  get Clients() {
    return this.clients;
  }

  @Mutation
  setClients(clients: Client[]) {
    this.clients = clients;    
  }

  @Action({commit: 'setClients', rawError: true})
  async getClients(): Promise<Client[]> {
    return await $axios.$get('/client')    
  }
}
