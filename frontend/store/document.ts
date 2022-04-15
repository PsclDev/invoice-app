import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { Document } from '~/models/document';
import { $axios } from '~/utils/axios';

@Module({
  name: 'document',
  stateFactory: true,
  namespaced: false,
})
export default class DocumentModule extends VuexModule {
  readonly PREFIX: string = '/document';
  readonly OFFER: string = '/offer';
  readonly INVOICE: string = '/invoice';

  documents: Array<Document> = [];

  get Documents() {
    return this.documents;
  }

  @Mutation
  setDocuments(docs: Document[]) {
    this.documents = docs;
  }

  @Action({ commit: 'setDocuments', rawError: true })
  async getDocuments(): Promise<Document[]> {
    return await $axios.$get(this.PREFIX);
  }
}
