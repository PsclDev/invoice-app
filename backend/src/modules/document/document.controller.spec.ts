import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  companyClientId,
  documentSeed,
  offerId,
  privateClientId,
  TestSqliteModule,
} from '@testing';
import { DocumentController } from './document.controller';
import { Invoice, Offer } from './document.entity';
import { DocumentService } from './services/document.service';
import { FileService, InvoiceService, OfferService } from './services';
import { ClientModule, MailModule } from '..';

describe('DocumentController', () => {
  let documentController: DocumentController;
  let createdOfferId;
  let createdInvoiceId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TestSqliteModule(), ClientModule, MailModule],
      controllers: [DocumentController],
      providers: [DocumentService, FileService, OfferService, InvoiceService],
    }).compile();

    documentController = module.get<DocumentController>(DocumentController);
    await documentSeed();
  });

  it('should get a new offer number', async () => {
    const newOfferNr = await documentController.getNewOffereNr();
    expect(newOfferNr).toBe(2);
  });

  it('should create a offer', async () => {
    const offer = await documentController.createOffer({
      offerNr: 2,
      dateOfIssue: new Date('2022-01-01'),
      clientId: privateClientId,
      description: ['a', 'b', 'c'],
      subTotal: 1000,
      tax: 190,
      taxRate: 19,
      total: 1190,
    });

    createdOfferId = offer.id;
    expect(offer).toBeDefined();
  });

  it('should create a invoice from a offer', async () => {
    const invoice = await documentController.convertOffer(createdOfferId);
    expect(invoice).toBeDefined();
  });

  it('should get a new invoice number', async () => {
    const newInvoiceNr = await documentController.getNewInvoiceNr();
    expect(newInvoiceNr).toBe(2);
  });

  it('should create a invoice', async () => {
    const invoice = await documentController.createInvoice({
      invoiceNr: 2,
      dateOfIssue: new Date('2022-01-01'),
      dueDate: new Date('2022-01-15'),
      clientId: companyClientId,
      description: ['a', 'b', 'c'],
      subTotal: 200,
      tax: 38,
      taxRate: 19,
      alreadyPaid: 10,
      total: 228,
    });

    createdInvoiceId = invoice.id;
    expect(invoice).toBeDefined();
  });

  it('should fail to create a invoice', async () => {
    const create = async () => {
      await documentController.createInvoice({
        invoiceNr: 2,
        dateOfIssue: new Date('2022-01-01'),
        dueDate: new Date('2022-01-15'),
        clientId: companyClientId,
        description: ['a', 'b', 'c'],
        subTotal: 200,
        tax: 38,
        taxRate: 19,
        alreadyPaid: 10,
        total: 228,
      });
    };

    expect(create()).rejects.toThrow(HttpException);
    expect(create()).rejects.toThrow('Invoice already exists');
  });

  it('should find a document by id', async () => {
    const client = await documentController.findById(createdInvoiceId);
    expect(client).toBeDefined();
  });

  it('should update a offer', async () => {
    const dateOfIssue = new Date('2022-12-31');
    await documentController.updateOffer(offerId, {
      dateOfIssue,
    });

    const offer = (await documentController.findById(offerId)) as Offer;
    expect(offer).toBeDefined();
    expect(offer.dateOfIssue).toStrictEqual(dateOfIssue);
  });

  it('should update a invoice', async () => {
    const alreadyPaid = 228;
    const total = 218;

    await documentController.updateInvoice(createdInvoiceId, {
      alreadyPaid,
      total,
    });

    const invoice = (await documentController.findById(
      createdInvoiceId,
    )) as Invoice;
    expect(invoice).toBeDefined();
    expect(invoice.alreadyPaid).toBe(alreadyPaid);
    expect(invoice.total).toBe(total);
  });

  it('should delete a document by id', async () => {
    const deleted = await documentController.deleteDocument(createdInvoiceId);
    expect(deleted).toBe(createdInvoiceId);
  });

  it('should fail to delete a document', async () => {
    const deleteDoc = async () => {
      await documentController.deleteDocument('abcdefg');
    };

    expect(deleteDoc()).rejects.toThrow(NotFoundException);
  });

  it('should find all documents', async () => {
    const docs = await documentController.findAll();
    expect(docs.length).toBe(4);
  });
});
