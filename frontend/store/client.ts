import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { Client } from '~/models/client';
import { $axios } from '~/utils/axios';

@Module({
  name: 'client',
  stateFactory: true,
  namespaced: false,
})
export default class ClientModule extends VuexModule {
  readonly PREFIX: string = '/client';
  readonly COMPANY: string = '/company';
  clients: Array<Client> = [];

  get Clients() {
    return this.clients;
  }

  @Mutation
  setClients(clients: Client[]) {
    this.clients = clients;
  }

  @Mutation
  setClient(client: Client, remove: boolean = false) {
    const clients = this.clients.filter(
      (c) => c.id !== client.id && c.id !== undefined
    );
    if (!remove) clients.push(client);
    this.clients = clients;
  }

  @Mutation
  newClient(client: Client) {
    this.clients.push(client);
  }

  @Mutation
  delClient(clientId: string) {
    const clients = this.clients.filter((c) => c.id !== clientId);
    this.clients = clients;
  }

  @Action({ commit: 'setClients', rawError: true })
  async getClients(): Promise<Client[]> {
    return await $axios.$get(this.PREFIX);
  }

  @Action({ commit: 'newClient', rawError: true })
  createClient(): Client {
    return {
      firstname: '',
      lastname: '',
      gender: 'MALE',
    } as Client;
  }

  @Action({ commit: 'setClient', rawError: true })
  async saveNewClient(client: Client): Promise<Client> {
    if (client.company)
      return await $axios.$post(`${this.PREFIX}${this.COMPANY}`, client);
    else return await $axios.$post(`${this.PREFIX}`, client);
  }

  @Action({ commit: 'setClient', rawError: true })
  async updateClient(client: Client): Promise<Client> {
    if (client.company)
      return await $axios.$patch(
        `${this.PREFIX}${this.COMPANY}/${client.id}`,
        client
      );
    else return await $axios.$patch(`${this.PREFIX}/${client.id}`, client);
  }

  @Action({ commit: 'delClient', rawError: true })
  async deleteClient(client: Client): Promise<Client> {
    return await $axios.$delete(`${this.PREFIX}/${client.id}`);
  }
}
