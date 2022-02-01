import { Body, Controller, Delete, Get, Logger, Param, Patch, Post } from '@nestjs/common';
import { CreateInvoiceDto, CreateOfferDto, InvoiceDto, OfferDto } from './document.dto';
import { Document, Invoice } from './document.entity';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name)

  constructor(
    private readonly docService: DocumentService,
  ) { }
    
  @Get()
  async findAll(): Promise<{}> {
    return this.docService.findAll();
  }
  
  @Get(':id')
  async findById(@Param('id') id: string): Promise<{}> {
    return this.docService.findById(id);
  }

  @Post('/invoice')
  async createInvoice(@Body() body: CreateInvoiceDto): Promise<Document> {
    this.logger.log('Create Invoice', body)
    return await this.docService.createInvoice(body);
  }

  @Patch('/offer')
  async updateInvoice(@Body() body: InvoiceDto) {
    this.logger.log('Update Invoice', body)
    return await this.docService.updateInvoice(body);
  }
  
  @Post('/offer')
  async createOffer(@Body() body: CreateOfferDto): Promise<Document> {
    this.logger.log('Create Offer', body)
    return await this.docService.createOffer(body);
  }

  @Patch('/offer')
  async updateOffer(@Body() body: OfferDto) {
    this.logger.log('Update Offer', body)
    return await this.docService.updateOffer(body);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string) {
    return await this.docService.delete(id);
  }
}
