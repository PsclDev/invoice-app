import { DateTime } from 'luxon';

import { Client, Document, DocumentForm, DocumentType } from '@/types';

export default function useDocumentHelper() {
  const i18n = useI18n();
  const clientHelper = useClientHelper();
  const dateFormat = 'yyyy-MM-dd';

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

  const calculateSubtotal = (description: string) => {
    let sum = 0;
    const regex = /^(\d+(?:\.\d{1,2})?)€/;

    for (const line of description.split('\n')) {
      const match = line.match(regex);
      if (match) {
        const amount = parseFloat(match[1]);
        sum += amount;
      }
    }

    return sum;
  };

  const getDueDate = (dateOfIssue: string) => {
    return DateTime.fromFormat(dateOfIssue, dateFormat)
      .plus({ days: 8 })
      .toFormat(dateFormat);
  };

  return {
    calculateSubtotal,
    dateFormat,
    getDueDate,
    getName,
    isOffer,
    isInvoice,
  };
}
