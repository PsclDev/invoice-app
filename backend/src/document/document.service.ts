import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvoiceDto, CreateOfferDto, InvoiceDto, OfferDto } from './document.dto';
import { Document, Invoice, Offer } from './document.entity';
import { customAlphabet } from 'nanoid';
import { NotFoundError } from 'rxjs';

@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
        @InjectRepository(Offer)
        private offerRepository: Repository<Offer>,
    ) { }

    async findAll(): Promise<Document[]> {
        return await this.documentRepository.find();        
    }

    async findById(id: string): Promise<Document[]> {
        return await this.documentRepository.find({id});        
    }

    async createInvoice(invoiceDto: CreateInvoiceDto): Promise<Document> {
        const total = Number(invoiceDto.subTotal + invoiceDto.tax - invoiceDto.alreadyPaid);
        const invoice: Invoice = {
            id: this.generateId(),
            invoiceId: invoiceDto.invoiceId,
            subTotal: invoiceDto.subTotal,
            tax: invoiceDto.tax,
            alreadyPaid: invoiceDto.alreadyPaid,
            total: total,
            dueDate: invoiceDto.dueDate,
            client: invoiceDto.client,
            dateOfIssue: invoiceDto.dateOfIssue,
            description: invoiceDto.description
        }

        return await this.invoiceRepository.save(invoice);        
    }

    async updateInvoice(invoiceDto: InvoiceDto) {
        const total = Number(invoiceDto.subTotal + invoiceDto.tax - invoiceDto.alreadyPaid);
        
        const invoice = {
            invoiceId: invoiceDto.invoiceId,
            subTotal: invoiceDto.subTotal,
            tax: invoiceDto.tax,
            alreadyPaid: invoiceDto.alreadyPaid,
            total: total,
            dueDate: invoiceDto.dueDate,
            client: invoiceDto.client,
            dateOfIssue: invoiceDto.dateOfIssue,
            description: invoiceDto.description
        }

        const result = await this.invoiceRepository.update({ id: invoiceDto.id }, invoice);
        
        if (result.affected <= 0) {
            throw new NotFoundException();
        }
    }

    async createOffer(offerDto: CreateOfferDto): Promise<Document> {
        const total = Number(offerDto.subTotal + offerDto.tax);
        const offer: Offer = {
            id: this.generateId(),
            subTotal: offerDto.subTotal,
            tax: offerDto.tax,
            total: total,
            client: offerDto.client,
            dateOfIssue: offerDto.dateOfIssue,
            description: offerDto.description            
        }

        return await this.offerRepository.save(offer);
    }

    async updateOffer(offerDto: OfferDto) {
        const total = Number(offerDto.subTotal + offerDto.tax);
        const offer = {            
            subTotal: offerDto.subTotal,
            tax: offerDto.tax,
            total: total,
            client: offerDto.client,
            dateOfIssue: offerDto.dateOfIssue,
            description: offerDto.description 
        }

        const result = await this.offerRepository.update({ id: offerDto.id }, offer);
        
        if (result.affected <= 0) {
            throw new NotFoundException();
        }
    }

    async delete(id: string) {
        const result = await this.documentRepository.delete({ id });
        if (result.affected <= 0) {
            throw new NotFoundException();
        }
    }

    private generateId(): string {
        const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
        return customAlphabet(alphabet, 8)();
    }
}
