import { capitalizeString } from '@utils';
import { Route } from '@modules/routes';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  CreateInvoiceDto,
  CreateOfferDto,
  DocumentMailOptionsDto,
  UpdateInvoiceDto,
  UpdateOfferDto,
} from './document.dto';
import { Document } from './document.entity';
import { DocumentService, OfferService, InvoiceService } from './services';

@ApiTags(capitalizeString(Route.DOCUMENT))
@Controller(Route.DOCUMENT)
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(
    private readonly docService: DocumentService,
    private readonly offerService: OfferService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Get()
  async findAll(): Promise<Document[]> {
    this.logger.log('Get all documents');
    return this.docService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Document> {
    this.logger.log(`Get document by id: ${id}`);
    return this.docService.findById(id);
  }

  @Get('/invoice/nr')
  async getNewInvoiceNr(): Promise<number> {
    this.logger.log(`Get new invoice nr`);
    return this.invoiceService.getNewInvoiceNr();
  }

  @Post('/invoice')
  async createInvoice(@Body() body: CreateInvoiceDto): Promise<Document> {
    this.logger.log('Post Invoice', body);
    return await this.invoiceService.createInvoice(body);
  }

  @Patch('/invoice/:id')
  async updateInvoice(@Param('id') id: string, @Body() body: UpdateInvoiceDto) {
    this.logger.log(`Patch Invoice with id: ${id}`, body);
    return await this.invoiceService.updateInvoice(id, body);
  }

  @Get('/offer/nr')
  async getNewOffereNr(): Promise<number> {
    this.logger.log(`Get new offer nr`);
    return this.offerService.getNewOfferNr();
  }

  @Post('/offer')
  async createOffer(@Body() body: CreateOfferDto): Promise<Document> {
    this.logger.log('Post Offer', body);
    return await this.offerService.createOffer(body);
  }

  @Patch('/offer/:id')
  async updateOffer(@Param('id') id: string, @Body() body: UpdateOfferDto) {
    this.logger.log(`Patch Offer with id: ${id}`, body);
    return await this.offerService.updateOffer(id, body);
  }

  @Post('/offer/:id/convert')
  async convertOffer(@Param('id') id: string) {
    this.logger.log(`Post Offer to convert with id: ${id}`);
    return await this.offerService.convertOffer(id);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string): Promise<string> {
    this.logger.log(`Delete document with id: ${id}`);
    return await this.docService.delete(id);
  }

  @Get('/print/:id')
  async printDocument(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Print document with id: ${id}`);
    const link = await this.docService.print(id);
    res.header(
      'Cache-Control',
      'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
    );
    res.redirect(301, link);
  }

  @Post('/mail/:id')
  async sendDocument(
    @Param('id') id: string,
    @Body() body: DocumentMailOptionsDto,
  ): Promise<boolean> {
    this.logger.log(`Mail document with id: ${id}, with options: ${body}`);
    return await this.docService.mail(id, body);
  }
}
