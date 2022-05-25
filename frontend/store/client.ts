import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { Client } from '~/models/client';
import { Document } from '~/models/document';
import { $axios } from '~/utils/axios';

@Module({
  name: 'client',
  stateFactory: true,
  namespaced: false,
})
export default class ClientModule extends VuexModule {
  readonly VERSION: string = '/v1';
  readonly PREFIX: string = `${this.VERSION}/client`;
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
  setClient(client: Client) {
    const clients = this.clients.filter(
      (c) => c.id !== client.id && c.id !== undefined
    );

    clients.push(client);
    this.clients = clients;
  }

  @Mutation
  newClient(client: Client) {
    this.clients.unshift(client);
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
  createLocalClient(name: string): Client {
    return {
      id: '1',
      firstname: name.split(' ')[0],
      lastname: name.split(' ')[1],
      gender: 'MALE',
      documents: [] as Document[],
    } as Client;
  }

  @Action({ commit: 'setClient', rawError: true })
  async createClient(client: Client): Promise<Client> {
    if (client.company)
      return await $axios.$post(`${this.PREFIX}${this.COMPANY}`, client);
    else return await $axios.$post(`${this.PREFIX}`, client);
  }

  @Action({ commit: 'setClient', rawError: true })
  async updateClient(client: Client): Promise<Client> {
    if (client.company)
      await $axios.$patch(`${this.PREFIX}${this.COMPANY}/${client.id}`, client);
    else await $axios.$patch(`${this.PREFIX}/${client.id}`, client);

    return client;
  }

  @Action({ commit: 'delClient', rawError: true })
  async deleteClient(client: Client): Promise<string> {
    return await $axios.$delete(`${this.PREFIX}/${client.id}`);
  }

  @Action({ commit: 'delClient', rawError: true })
  deleteLocalClient(id: string): string {
    return id;
  }
}
