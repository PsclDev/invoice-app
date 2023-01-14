<template>
  <div class="row text-center">
    <h1>{{ $t('dashboard.title') }}</h1>
    <h5>
      {{ $t('dashboard.stats_update') }}
      {{ getDate(statistics.updatedAt, DateTimeFormat.TIME) }}
    </h5>
    <template v-if="!isLoading">
      <section class="mb-5">
        <h3>{{ $t('dashboard.all_time') }}</h3>
        <div class="row d-flex justify-content-center mb-5">
          <div class="col-12 col-sm-6 d-flex justify-content-end">
            <highchart class="chart" :options="getClientStats()" />
          </div>
          <div class="col-12 col-sm-6 d-flex justify-content-start">
            <highchart class="chart" :options="getDocumentStats()" />
          </div>
        </div>
        <div class="row">
          <div class="col-4 h4">
            {{ $t('dashboard.revenue') }}:
            {{ statistics.documents.allTime.revenues }}€
          </div>
          <div class="col-4 h4">
            {{ $t('dashboard.tax') }}: {{ statistics.documents.allTime.taxes }}€
          </div>
          <div class="col-4 h4">
            {{ $t('dashboard.total_revenue') }}:
            {{ statistics.documents.allTime.totalRevenues.toFixed(2) }}€
          </div>
        </div>
      </section>
      <section>
        <h3>{{ $t('dashboard.yearly') }}</h3>
        <div class="d-flex justify-content-center gap-2 mb-3">
          <button
            v-for="yearObj of statistics.documents.years"
            :key="yearObj.year"
            class="btn btn-link"
            :class="currentYear.year === yearObj.year ? '' : 'inactive'"
            @click="setCurrentYear(yearObj)"
          >
            {{ yearObj.year }}
          </button>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-12 col-sm-6 mb-3 mb-sm-0 d-flex justify-content-end">
            <highchart
              class="chart"
              :options="getDocumentStatsByYear(currentYear.year)"
            />
          </div>
          <div class="col-12 col-sm-6 d-flex justify-content-center">
            <div class="d-flex flex-column">
              <div class="col-sm-4 h4">
                {{ $t('dashboard.revenue') }}: {{ yearlyRevenues }}€
              </div>
              <div class="col-sm-4 h4">
                {{ $t('dashboard.tax') }}: {{ yearlyTaxes }}€
              </div>
              <div class="col-sm-4 h4">
                {{ $t('dashboard.total_revenue') }}: {{ yearlyTotalRevenues }}€
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import { DocumentYearsStatistics, Statistics } from '~/models';
import StatisticsModule from '~/store/statistics';
import { getDate } from '~/utils/helper';
import { DateTimeFormat } from '~/types';

export default Vue.extend({
  name: 'DashboardPage',
  data() {
    return {
      getDate,
      DateTimeFormat,
      store: getModule(StatisticsModule, this.$store),
      isLoading: true,
      statistics: {} as Statistics,
      currentYear: {} as DocumentYearsStatistics,
    };
  },
  head() {
    return {
      title: `${this.$t('title')} - ${this.$t('home')}`,
    };
  },
  computed: {
    yearlyRevenues(): number {
      return this.currentYear.revenues;
    },
    yearlyTaxes(): number {
      return this.currentYear.taxes;
    },
    yearlyTotalRevenues(): string {
      return this.currentYear.totalRevenues.toFixed(2);
    },
    chartsColor(): string {
      return localStorage.getItem('APP_THEME') === 'dark'
        ? '#f9f9f9'
        : '#181820';
    },
  },
  mounted() {
    this.getStatistics();
  },
  methods: {
    async getStatistics() {
      this.isLoading = true;
      await this.store.getStatistics();
      this.statistics = this.store.Statistics;
      this.isLoading = false;
    },
    setCurrentYear(year: DocumentYearsStatistics) {
      this.currentYear = year;
    },
    getBasePieChart(title: string, tooltip?: string) {
      return {
        chart: {
          backgroundColor: null,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
        },
        title: {
          text: this.$tc(title, 2),
          style: {
            color: this.chartsColor,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          pointFormat:
            tooltip || '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
          enabled: false,
          point: {
            valueSuffix: '%',
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            colors: ['#3ee577', '#42fcdb'],
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              color: this.chartsColor,
              borderColor: null,
              style: {
                textOutline: false,
              },
            },
          },
        },
        credits: {
          enabled: false,
        },
        series: [],
      };
    },
    getClientStats() {
      const globalClientStats = this.store.Statistics.clients;
      const series = [
        {
          name: this.$tc('client', 2),
          colorByPoint: true,
          data: [
            {
              name: this.$t('enums.client_type.private'),
              y: (globalClientStats.privates / globalClientStats.all) * 100,
            },
            {
              name: this.$t('enums.client_type.company'),
              y: (globalClientStats.companies / globalClientStats.all) * 100,
            },
          ],
        },
      ];

      const chartOptions = this.getBasePieChart('client');
      chartOptions.series = series as never[];

      return chartOptions;
    },
    getDocumentStats() {
      const globalClientStats = this.store.Statistics.documents;
      const series = [
        {
          name: this.$tc('document', 2),
          colorByPoint: true,
          data: [
            {
              name: this.$t('enums.document_type.offer'),
              y:
                (globalClientStats.allTime.offers /
                  globalClientStats.allTime.all) *
                100,
            },
            {
              name: this.$t('enums.document_type.invoice'),
              y:
                (globalClientStats.allTime.invoices /
                  globalClientStats.allTime.all) *
                100,
            },
          ],
        },
      ];

      const chartOptions = this.getBasePieChart('document');
      chartOptions.series = series as never[];

      return chartOptions;
    },
    getDocumentStatsByYear(year?: number) {
      const yearToSearch =
        year ||
        this.statistics.documents.years[
          this.statistics.documents.years.length - 1
        ].year;

      this.currentYear = this.statistics.documents.years.find(
        (y) => y.year === yearToSearch
      )!;

      const yearStats = this.statistics.documents.years.find(
        (s) => s.year === yearToSearch
      );
      const series = [
        {
          name: this.$tc('document', 2),
          colorByPoint: true,
          data: [
            {
              name: this.$t('enums.document_type.offer'),
              y: (yearStats!.offers / yearStats!.all) * 100,
            },
            {
              name: this.$t('enums.document_type.invoice'),
              y: (yearStats!.invoices / yearStats!.all) * 100,
            },
          ],
        },
      ];

      const chartOptions = this.getBasePieChart('documents');
      chartOptions.series = series as never[];

      return chartOptions;
    },
  },
});
</script>

<style lang="scss" scoped>
.inactive {
  opacity: 0.5;
}

.chart {
  height: 200px;
  width: 450px;
}
</style>
