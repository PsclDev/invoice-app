import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DocumentBasePeriodStatsDto,
  DocumentYearStatsDto,
  StatisticsDto,
  ClientStatsDto,
  DocumentStatsDto,
  Cashflow,
} from './statistic.dto';
import { Client, CompanyClient } from '../client/client.entity';
import { Offer, Invoice } from '../document/document.entity';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { CustomCacheService } from '@helper';
dayjs.extend(isBetween);

@Injectable()
export class StatisticService {
  private readonly logger = new Logger(StatisticService.name);

  constructor(
    private readonly customCacheService: CustomCacheService<StatisticsDto>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(CompanyClient)
    private companyClientRepository: Repository<CompanyClient>,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async getStats(): Promise<StatisticsDto> {
    const cachedStats = await this.customCacheService.getCachedData();
    if (cachedStats) {
      this.logger.log('Getting stats from cache');
      return cachedStats[0];
    }

    this.logger.log('No cached stats found, calculating...');
    const stats = await this.generateStats();
    await this.customCacheService.setDataToCache([stats]);

    return stats;
  }

  private async generateStats(): Promise<StatisticsDto> {
    const clientStats = await this.getClientStats();
    const documentStats = await this.getDocumentStats();

    const stats: StatisticsDto = {
      clients: clientStats,
      documents: documentStats,
      updatedAt: new Date(),
    };

    return stats;
  }

  private async getClientStats(): Promise<ClientStatsDto> {
    const companies = await this.companyClientRepository.count();
    const privates = (await this.clientRepository.count()) - companies;

    return {
      all: privates + companies,
      privates,
      companies,
    };
  }

  private async getDocumentStats(): Promise<DocumentStatsDto> {
    const offers = await this.offerRepository.find();
    const invoices = await this.invoiceRepository.find({
      order: {
        dateOfIssue: 'ASC',
      },
    });

    const allTime = await this.getAllTimeStats(offers, invoices);
    const years = await this.getStatsForYears(offers, invoices);

    return {
      allTime,
      years,
    };
  }

  private getAllTimeStats(
    offers: Offer[],
    invoices: Invoice[],
  ): DocumentBasePeriodStatsDto {
    const allTimeRevenues = this.calculateRevenues(invoices);
    return {
      all: offers.length + invoices.length,
      offers: offers.length,
      invoices: invoices.length,
      revenues: allTimeRevenues.revenues,
      taxes: allTimeRevenues.taxes,
      totalRevenues: allTimeRevenues.totalRevenues,
    };
  }

  private getStatsForYears(
    offers: Offer[],
    invoices: Invoice[],
  ): DocumentYearStatsDto[] {
    const years: DocumentYearStatsDto[] = [];
    const firstYear = dayjs(invoices[0].dateOfIssue).year();
    const lastYear = dayjs(invoices[invoices.length - 1].dateOfIssue).year();

    for (let curYear = firstYear; curYear <= lastYear; curYear++) {
      const yearlyOffers = this.getDocumentsBetweenYear<Offer>(curYear, offers);
      const yearlyInvoices = this.getDocumentsBetweenYear<Invoice>(
        curYear,
        invoices,
      );

      let yearlyRevenues: Cashflow;
      if (yearlyInvoices.length > 0)
        yearlyRevenues = this.calculateRevenues(yearlyInvoices);
      else {
        yearlyRevenues = {
          revenues: 0,
          taxes: 0,
          totalRevenues: 0,
        };
      }

      const year: DocumentYearStatsDto = {
        year: curYear,
        all: yearlyOffers.length + yearlyInvoices.length,
        offers: yearlyOffers.length,
        invoices: yearlyInvoices.length,
        revenues: yearlyRevenues.revenues,
        taxes: yearlyRevenues.taxes,
        totalRevenues: yearlyRevenues.totalRevenues,
      };
      years.push(year);
    }

    return years;
  }

  private getDocumentsBetweenYear<T>(year: number, arr: T[]): T[] {
    return arr.filter((i) => {
      return dayjs(i['dateOfIssue']).isBetween(
        `${year}-01-01`,
        `${year}-12-31`,
      );
    });
  }

  private calculateRevenues(invoices: Invoice[]): Cashflow {
    const revenues = this.sum(invoices, 'subTotal');
    const taxes = this.sum(invoices, 'tax');

    return { revenues, taxes, totalRevenues: revenues + taxes };
  }

  private sum(arr: any[], prop: string): number {
    const value = arr
      .map((i) => i[prop])
      .reduce((a: number, b: number) => +a + +b);
    return +parseFloat(value).toFixed(2);
  }
}
