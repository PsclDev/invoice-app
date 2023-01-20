export interface StatisticsResponse {
  clients: ClientStatsInterface;
  documents: DocumentStatsInterface;
  updatedAt: Date;
}

export interface ClientStatsInterface {
  all: number;
  privates: number;
  companies: number;
}

export interface DocumentStatsInterface {
  allTime: DocumentBasePeriodStatsInterface;
  years: DocumentYearStatsInterface[];
}

export interface DocumentBasePeriodStatsInterface {
  all: number;
  offers: number;
  invoices: number;
  revenues: number;
  taxes: number;
  totalRevenues: number;
}

export interface DocumentYearStatsInterface
  extends DocumentBasePeriodStatsInterface {
  year: number;
}
