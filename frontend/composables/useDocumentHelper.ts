import { Client, Document, DocumentForm, DocumentType } from '@/types';

export default function useDocumentHelper() {
  const i18n = useI18n();
  const clientHelper = useClientHelper();

  const isOffer = (doc: Document | DocumentForm) => {
    return doc.type === DocumentType.OFFER;
  };

  const isInvoice = (doc: Document | DocumentForm) => {
    return doc.type === DocumentType.INVOICE;
  };

  const getName = (doc: Document | DocumentForm, client?: Client | null) => {
    const documentType = `${i18n.t(
      `DOCUMENTS.TYPE.${isOffer(doc) ? 'OFFER' : 'INVOICE'}`,
    )}`;
    const documentNr = `${isOffer(doc) ? doc.offerNr : doc.invoiceNr}`.padStart(
      4,
      '0',
    );

    const clientName = client ? ` | ${clientHelper.getName(client)}` : '';

    return documentType.concat(' #', documentNr) + clientName;
  };

  return { isOffer, isInvoice, getName };
}
