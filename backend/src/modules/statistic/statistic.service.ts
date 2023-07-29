import { CustomCacheService } from '@modules/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { Repository } from 'typeorm';

import { Client, CompanyClient } from '../client/client.entity';
import { Invoice, Offer } from '../document/document.entity';
import {
  Cashflow,
  ClientStatsDto,
  DocumentBasePeriodStatsDto,
  DocumentMonthStatsDto,
  DocumentQuarterStatsDto,
  DocumentStatsDto,
  DocumentYearStatsDto,
  StatisticsDto,
} from './statistic.dto';
dayjs.extend(isBetween);

@Injectable()
export class StatisticService {
  private readonly logger = new Logger(StatisticService.name);
  private offers: Offer[];
  private invoices: Invoice[];

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
    this.offers = await this.offerRepository.find({
      order: {
        dateOfIssue: 'ASC',
      },
    });
    this.invoices = await this.invoiceRepository.find({
      order: {
        dateOfIssue: 'ASC',
      },
    });

    const allTime = await this.getAllTimeStats();

    let years: DocumentYearStatsDto[];
    if (this.invoices.length > 1) {
      years = await this.getStatsForYears();
    } else {
      years = [
        {
          year: new Date().getFullYear(),
          quarters: [],
          months: [],
          all: 0,
          offers: 0,
          invoices: 0,
          revenues: 0,
          taxes: 0,
          totalRevenues: 0,
        },
      ];
    }

    return {
      allTime,
      years,
    };
  }

  private getAllTimeStats(): DocumentBasePeriodStatsDto {
    const allTimeRevenues = this.calculateRevenues(this.invoices);
    return {
      all: this.offers.length + this.invoices.length,
      offers: this.offers.length,
      invoices: this.invoices.length,
      revenues: allTimeRevenues.revenues,
      taxes: allTimeRevenues.taxes,
      totalRevenues: allTimeRevenues.totalRevenues,
    };
  }

  private getStatsForYears(): DocumentYearStatsDto[] {
    const years: DocumentYearStatsDto[] = [];
    const firstYear = dayjs(this.invoices[0].dateOfIssue).year();
    const lastYear = dayjs(
      this.invoices[this.invoices.length - 1].dateOfIssue,
    ).year();

    for (let curYear = firstYear; curYear <= lastYear; curYear++) {
      const yearlyOffers = this.getDocumentsBetweenRange<Offer>(
        this.offers,
        curYear,
      );
      const yearlyInvoices = this.getDocumentsBetweenRange<Invoice>(
        this.invoices,
        curYear,
      );
      const yearlyRevenues: Cashflow = this.calculateRevenues(yearlyInvoices);

      const months = this.getStatsForMonths(curYear);
      const quarterOne = this.getStatsForQuarter(curYear, 1, 1, 3);
      const quarterTwo = this.getStatsForQuarter(curYear, 2, 4, 6);
      const quarterThree = this.getStatsForQuarter(curYear, 3, 7, 9);
      const quarterFour = this.getStatsForQuarter(curYear, 4, 10, 12);

      const year: DocumentYearStatsDto = {
        year: curYear,
        quarters: [quarterOne, quarterTwo, quarterThree, quarterFour],
        months,
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

  private getStatsForMonths(year: number): DocumentMonthStatsDto[] {
    const months: DocumentMonthStatsDto[] = [];
    for (let curMonth = 1; curMonth <= 12; curMonth++) {
      const monthlyOffers = this.getDocumentsBetweenRange<Offer>(
        this.offers,
        year,
        curMonth,
        curMonth,
      );

      const monthlyInvoices = this.getDocumentsBetweenRange<Invoice>(
        this.invoices,
        year,
        curMonth,
        curMonth,
      );

      const monthlyRevenues: Cashflow = this.calculateRevenues(monthlyInvoices);

      const month: DocumentMonthStatsDto = {
        month: curMonth,
        all: monthlyOffers.length + monthlyInvoices.length,
        offers: monthlyOffers.length,
        invoices: monthlyInvoices.length,
        revenues: monthlyRevenues.revenues,
        taxes: monthlyRevenues.taxes,
        totalRevenues: monthlyRevenues.totalRevenues,
      };
      months.push(month);
    }

    return months;
  }

  private getStatsForQuarter(
    year: number,
    quarter: number,
    startingMonth,
    endingMonth,
  ): DocumentQuarterStatsDto {
    const quarterOffers = this.getDocumentsBetweenRange<Offer>(
      this.offers,
      year,
      startingMonth,
      endingMonth,
    );
    const quarterInvoices = this.getDocumentsBetweenRange<Invoice>(
      this.invoices,
      year,
      startingMonth,
      endingMonth,
    );
    const quarterRevenues: Cashflow = this.calculateRevenues(quarterInvoices);

    return {
      quarter,
      all: quarterOffers.length + quarterInvoices.length,
      offers: quarterOffers.length,
      invoices: quarterInvoices.length,
      revenues: quarterRevenues.revenues,
      taxes: quarterRevenues.taxes,
      totalRevenues: quarterRevenues.totalRevenues,
    };
  }

  private getDocumentsBetweenRange<T>(
    arr: T[],
    year: number,
    startingMonth = 1,
    endingMonth = 12,
  ): T[] {
    return arr.filter((i) => {
      return dayjs(i['dateOfIssue']).isBetween(
        `${year}-${startingMonth.toString().padStart(2, '0')}-01`,
        `${year}-${endingMonth.toString().padStart(2, '0')}-31`,
      );
    });
  }

  private calculateRevenues(invoices: Invoice[]): Cashflow {
    if (invoices.length === 0) {
      return {
        revenues: 0,
        taxes: 0,
        totalRevenues: 0,
      };
    }

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
