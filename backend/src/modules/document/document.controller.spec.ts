import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  companyClientId,
  documentSeed,
  offerId,
  privateClientId,
  TestSqliteModule,
} from 'util/testing';
import { DocumentController } from './document.controller';
import { Invoice, Offer } from './document.entity';
import { DocumentService } from './services/document.service';

describe('DocumentController', () => {
  let documentController: DocumentController;
  let createdDocumentId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TestSqliteModule()],
      controllers: [DocumentController],
      providers: [DocumentService],
    }).compile();

    documentController = module.get<DocumentController>(DocumentController);
    await documentSeed();
  });

  it('should create a offer', async () => {
    const offer = await documentController.createOffer({
      dateOfIssue: new Date('2022-01-01'),
      clientId: privateClientId,
      description: ['a', 'b', 'c'],
      subTotal: 1000,
      tax: 190,
      taxRate: 19,
      total: 1190,
      offerNr: 1,
    });

    expect(offer).toBeDefined();
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

    createdDocumentId = invoice.id;
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
    const client = await documentController.findById(createdDocumentId);
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

    await documentController.updateInvoice(createdDocumentId, {
      alreadyPaid,
      total,
    });

    const invoice = (await documentController.findById(
      createdDocumentId,
    )) as Invoice;
    expect(invoice).toBeDefined();
    expect(invoice.alreadyPaid).toBe(alreadyPaid);
    expect(invoice.total).toBe(total);
  });

  it('should delete a document by id', async () => {
    const deleted = await documentController.deleteDocument(createdDocumentId);
    expect(deleted).toBe(createdDocumentId);
  });

  it('should fail to delete a document', async () => {
    const deleteDoc = async () => {
      await documentController.deleteDocument('abcdefg');
    };

    expect(deleteDoc()).rejects.toThrow(NotFoundException);
  });

  it('should find all documents', async () => {
    const docs = await documentController.findAll();
    expect(docs.length).toBe(3);
  });
});
