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

  @Mutation
  setDocument(doc: Document) {
    const docs = this.documents.filter((d) => d.id !== doc.id);
    docs.push(doc);
    this.documents = docs;
  }

  @Mutation
  delDocument(docId: string) {
    const docs = this.documents.filter((d) => d.id !== docId);
    this.documents = docs;
  }

  @Action({ commit: 'setDocuments', rawError: true })
  async getDocuments(): Promise<Document[]> {
    return await $axios.$get(this.PREFIX);
  }

  @Action({ commit: 'setDocument', rawError: true })
  async updateDocument(doc: Document): Promise<Document> {
    if (doc.invoiceNr)
      return await $axios.$patch(
        `${this.PREFIX}${this.INVOICE}/${doc.id}`,
        doc
      );
    else
      return await $axios.$patch(`${this.PREFIX}${this.OFFER}/${doc.id}`, doc);
  }

  @Action({ commit: 'delDocument', rawError: true })
  async deleteDocument(doc: Document): Promise<string> {
    return await $axios.$delete(`${this.PREFIX}/${doc.id}`);
  }

  @Action({ rawError: true })
  async sendDocument(doc: Document): Promise<void> {
    await $axios.$post(`${this.PREFIX}/generate/${doc.id}`);
  }
}
