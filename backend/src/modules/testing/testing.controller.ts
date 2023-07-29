import { Route } from '@modules/routes';
import { Controller, Get, Logger, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { capitalizeString } from '@utils';
import { Response } from 'express';

import { TestingService } from './testing.service';

@ApiTags(capitalizeString(Route.TESTING))
@Controller(Route.TESTING)
export class TestingController {
  private readonly logger = new Logger(TestingController.name);

  constructor(private readonly testingService: TestingService) {}

  @Get('pdf/offer')
  async generateOfferPdfExample(@Res() res: Response) {
    this.logger.log('Generate offer pdf example');
    const link = await this.testingService.generateOfferPdfExample();
    res.header(
      'Cache-Control',
      'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
    );
    res.redirect(301, link);
  }

  @Get('pdf/invoice')
  async generateInvoicePdfExample(@Res() res: Response) {
    this.logger.log('Generate invoice pdf example');
    const link = await this.testingService.generateInvoicePdfExample();
    res.header(
      'Cache-Control',
      'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
    );
    res.redirect(301, link);
  }

  @Post('mail/offer/:email')
  async offerMailTest(@Param('email') email: string) {
    this.logger.log('Send offer test mail');
    return await this.testingService.offerMailTest(email);
  }

  @Post('mail/invoice/:email')
  async invoiceMailTest(@Param('email') email: string) {
    this.logger.log('Send invoice test mail');
    return await this.testingService.invoiceMailTest(email);
  }
}
