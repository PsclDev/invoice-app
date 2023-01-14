export interface ClientStatsInterface {
  all: number;
  privates: number;
  companies: number;
}

export interface DocumentBasePeriodStatsInterface {
  all: number;
  offers: number;
  invoices: number;
  revenues: number;
  taxes: number;
  totalRevenues: number;
}

export interface DocumentYearStatsDto extends DocumentBasePeriodStatsInterface {
  year: number;
}

export interface DocumentStatsInterface {
  allTime: DocumentBasePeriodStatsInterface;
  years: DocumentYearStatsDto[];
}

export interface StatisticsInterface {
  clients: ClientStatsInterface;
  documents: DocumentStatsInterface;
  updatedAt?: Date;
}
