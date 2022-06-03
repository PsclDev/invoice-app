import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { Document } from '~/models';
import { $axios } from '~/utils/axios';

@Module({
  name: 'document',
  stateFactory: true,
  namespaced: false,
})
export default class DocumentModule extends VuexModule {
  readonly VERSION: string = '/v1';
  readonly PREFIX: string = `${this.VERSION}/document`;
  readonly OFFER: string = '/offer';
  readonly INVOICE: string = '/invoice';

  documents: Array<Document> = [];

  get Prefix() {
    return this.PREFIX;
  }

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
  convertOffer(docs: { offer: Document; invoice: Document }) {
    const filtered = this.documents.filter((d) => d.id !== docs.offer.id);
    docs.offer.invoiceId = docs.invoice.id;
    filtered.push(docs.offer, docs.invoice);
    this.documents = filtered;
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

  @Action({ rawError: true })
  async getDocumentById(id: string): Promise<Document> {
    return await $axios.$get(`${this.PREFIX}/${id}`);
  }

  @Action({ rawError: true })
  async getOfferNr(): Promise<number> {
    return await $axios.$get(`${this.PREFIX}${this.OFFER}/nr`);
  }

  @Action({ rawError: true })
  async getInvoiceNr(): Promise<number> {
    return await $axios.$get(`${this.PREFIX}${this.INVOICE}/nr`);
  }

  @Action({ commit: 'setDocument', rawError: true })
  async createDocument(doc: Document): Promise<Document> {
    if (doc.invoiceNr)
      return await $axios.$post(`${this.PREFIX}${this.INVOICE}`, doc);
    else return await $axios.$post(`${this.PREFIX}${this.OFFER}`, doc);
  }

  @Action({ commit: 'setDocument', rawError: true })
  async updateDocument(doc: Document): Promise<Document> {
    if (doc.invoiceNr)
      await $axios.$patch(`${this.PREFIX}${this.INVOICE}/${doc.id}`, doc);
    else await $axios.$patch(`${this.PREFIX}${this.OFFER}/${doc.id}`, doc);

    return doc;
  }

  @Action({ commit: 'delDocument', rawError: true })
  async deleteDocument(doc: Document): Promise<string> {
    return await $axios.$delete(`${this.PREFIX}/${doc.id}`);
  }

  @Action({ rawError: true })
  async mailDocument(id: string): Promise<void> {
    await $axios.$post(`${this.PREFIX}/mail/${id}`);
  }

  @Action({ commit: 'convertOffer', rawError: true })
  async convertToInvoice(
    offer: Document
  ): Promise<{ offer: Document; invoice: Document }> {
    const invoice = await $axios.$post(
      `${this.PREFIX}${this.OFFER}/${offer.id}/convert`
    );
    return {
      offer,
      invoice,
    };
  }
}
