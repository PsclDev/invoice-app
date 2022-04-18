import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateInvoiceDto,
  CreateOfferDto,
  UpdateInvoiceDto,
  UpdateOfferDto,
} from './document.dto';
import { Document } from './document.entity';
import { DocumentService } from './document.service';

@ApiTags('Document')
@Controller('document')
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(private readonly docService: DocumentService) {}

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

  @Post('/invoice')
  async createInvoice(@Body() body: CreateInvoiceDto): Promise<Document> {
    this.logger.log('Post Invoice', body);
    return await this.docService.createInvoice(body);
  }

  @Patch('/invoice/:id')
  async updateInvoice(@Param('id') id: string, @Body() body: UpdateInvoiceDto) {
    this.logger.log(`Patch Invoice with id: ${id}`, body);
    return await this.docService.updateInvoice(id, body);
  }

  @Post('/offer')
  async createOffer(@Body() body: CreateOfferDto): Promise<Document> {
    this.logger.log('Post Offer', body);
    return await this.docService.createOffer(body);
  }

  @Patch('/offer/:id')
  async updateOffer(@Param('id') id: string, @Body() body: UpdateOfferDto) {
    this.logger.log(`Patch Offer with id: ${id}`, body);
    return await this.docService.updateOffer(id, body);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string): Promise<string> {
    this.logger.log(`Delete document with id: ${id}`);
    return await this.docService.delete(id);
  }

  @Post('/generate/:id')
  async generateDocument(@Param('id') id: string): Promise<string> {
    this.logger.log(`Generate document with id: ${id}`);
    return await this.docService.generate(id);
  }
}
