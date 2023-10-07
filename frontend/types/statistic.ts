export interface DocumentBasePeriodStats {
  all: number;
  offers: number;
  invoices: number;
  revenues: number;
  taxes: number;
  totalRevenues: number;
}

export interface DocumentMonthStats extends DocumentBasePeriodStats {
  month: number;
}

export interface DocumentQuarterStats extends DocumentBasePeriodStats {
  quarter: number;
}

export interface DocumentYearStats extends DocumentBasePeriodStats {
  year: number;
  quarters: DocumentQuarterStats[];
  months: DocumentMonthStats[];
}

export interface ClientStats {
  all: number;
  privates: number;
  companies: number;
}

export interface DocumentStats {
  allTime: DocumentBasePeriodStats;
  years: DocumentYearStats[];
}

export interface Statistics {
  clients: ClientStats;
  documents: DocumentStats;
  updatedAt?: Date;
}

export interface Cashflow {
  revenues: number;
  taxes: number;
  totalRevenues: number;
}
