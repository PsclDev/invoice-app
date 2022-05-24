import {
  ClientStatsInterface,
  DocumentBasePeriodStatsInterface,
  DocumentStatsInterface,
  DocumentYearStatsDto,
  StatisticsInterface,
} from '~/types/statistics';

export class DocumentBasePeriod implements DocumentBasePeriodStatsInterface {
  all!: number;
  offers!: number;
  invoices!: number;
  revenues!: number;
  taxes!: number;
  totalRevenues!: number;
}

export class DocumentYearsStatistics implements DocumentYearStatsDto {
  year!: number;
  all!: number;
  offers!: number;
  invoices!: number;
  revenues!: number;
  taxes!: number;
  totalRevenues!: number;
}

export class ClientStatistics implements ClientStatsInterface {
  all!: number;
  privates!: number;
  companies!: number;
}

export class DocumentStatistics implements DocumentStatsInterface {
  allTime!: DocumentBasePeriod;
  years!: DocumentYearsStatistics[];
}

export class Statistics implements StatisticsInterface {
  clients!: ClientStatistics;
  documents!: DocumentStatistics;
  updatedAt!: Date;
}
