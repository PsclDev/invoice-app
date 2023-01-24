export interface StatisticsDto {
  clients: ClientStatsDto;
  documents: DocumentStatsDto;
  updatedAt?: Date;
}

export interface ClientStatsDto {
  all: number;
  privates: number;
  companies: number;
}

export interface DocumentStatsDto {
  allTime: DocumentBasePeriodStatsDto;
  years: DocumentYearStatsDto[];
}

export interface DocumentBasePeriodStatsDto {
  all: number;
  offers: number;
  invoices: number;
  revenues: number;
  taxes: number;
  totalRevenues: number;
}

export interface DocumentMonthStatsDto extends DocumentBasePeriodStatsDto {
  month: number;
}

export interface DocumentQuarterStatsDto extends DocumentBasePeriodStatsDto {
  quarter: number;
}

export interface DocumentYearStatsDto extends DocumentBasePeriodStatsDto {
  year: number;
  quarters: DocumentQuarterStatsDto[];
  months: DocumentMonthStatsDto[];
}

export interface Cashflow {
  revenues: number;
  taxes: number;
  totalRevenues: number;
}
