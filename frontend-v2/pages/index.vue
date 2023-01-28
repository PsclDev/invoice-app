<template>
  <div class="flex flex-col items-center w-full">
    <template v-if="error"> <Error :error="error" /> </template>
    <template v-else-if="stats">
      <div class="text-5xl text-center">{{ $t('header.dashboard') }}</div>
      <div class="text-xl text-center mt-2">
        {{ $t('pages.dashboard.updatedAt') }} {{ updatedAt }}
      </div>

      <div class="mt-16">
        <div class="text-4xl text-center">
          {{ $t('pages.dashboard.all-time') }}
        </div>
        <div
          class="flex flex-col md:flex-row items-center md:justify-center gap-10 md:gap-24 mt-5"
        >
          <div class="w-56 h-56">
            <ChartDoughnut
              :key="allTimeDocumentChartKey"
              :chart-data="clientsChart"
            />
          </div>
          <div class="w-56 h-56">
            <ChartDoughnut
              :key="allTimeDocumentChartKey"
              :chart-data="allTimeDocumentChart"
            />
          </div>
        </div>
        <div class="flex justify-center gap-4 md:gap-10 mt-8">
          <div class="flex flex-col items-center text-2xl">
            <p>{{ $t('pages.dashboard.revenue') }}</p>
            {{ useCurrencyFormat(stats.documents.allTime.revenues) }}
          </div>
          <div class="flex flex-col items-center text-2xl">
            <p>{{ $t('pages.dashboard.taxes') }}</p>
            {{ useCurrencyFormat(stats.documents.allTime.taxes) }}
          </div>
          <div class="flex flex-col items-center text-2xl">
            <p class="truncate">{{ $t('pages.dashboard.total') }}</p>
            {{ useCurrencyFormat(stats.documents.allTime.totalRevenues) }}
          </div>
        </div>
      </div>

      <div class="mt-16">
        <div class="text-4xl text-center">
          {{ $t('pages.dashboard.yearly-stats') }}
        </div>
        <div class="flex justify-center gap-10 mt-2">
          <div v-for="yearObj in stats.documents.years" :key="yearObj.year">
            <button
              :class="
                activeYear.year === yearObj.year
                  ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400'
                  : ''
              "
              @click="changeActiveYear(yearObj.year)"
            >
              {{ yearObj.year }}
            </button>
          </div>
        </div>
        <div class="flex justify-center items-center gap-10 mt-10">
          <div class="w-56 h-56">
            <ChartDoughnut
              :key="yearlyDocumentChartKey"
              :chart-data="yearlyDocumentChart"
            />
          </div>
          <div class="flex flex-col gap-2 md:gap-5">
            <div class="flex flex-col items-center text-2xl">
              <p>{{ $t('pages.dashboard.revenue') }}</p>
              {{ useCurrencyFormat(activeYear.revenues) }}
            </div>
            <div class="flex flex-col items-center text-2xl">
              <p>{{ $t('pages.dashboard.taxes') }}</p>
              {{ useCurrencyFormat(activeYear.taxes) }}
            </div>
            <div class="flex flex-col items-center text-2xl">
              <p>{{ $t('pages.dashboard.total') }}</p>
              {{ useCurrencyFormat(activeYear.totalRevenues) }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon';
import { DocumentYearStatsInterface } from '~/types';

useHead({
  title: 'Statistics'
});

const { t: translate, locale } = useI18n();
const statsStore = useStatsStore();
const { stats, error } = storeToRefs(statsStore);
statsStore.getStats();

const updatedAt = computed(() => {
  return DateTime.fromJSDate(stats.value.updatedAt).toLocaleString(
    DateTime.TIME_24_SIMPLE
  );
});

const allTimeDocumentChartKey = ref(0);
const clientsChart = computed(() => {
  return {
    labels: [translate('common.private'), translate('common.company', 2)],
    dataset: {
      label: `${translate('chart.label')} ${stats.value.clients.all}`,
      data: [stats.value.clients.privates, stats.value.clients.companies],
      borderWidth: 3
    }
  };
});

const activeYear = ref<DocumentYearStatsInterface>(
  {} as DocumentYearStatsInterface
);

const allTimeDocumentChart = computed(() => {
  activeYear.value =
    stats.value.documents.years[stats.value.documents.years.length - 1];

  return {
    labels: [translate('common.offer', 2), translate('common.invoice', 2)],
    dataset: {
      label: `${translate('chart.label')} ${stats.value.documents.allTime.all}`,
      data: [
        stats.value.documents.allTime.offers,
        stats.value.documents.allTime.invoices
      ],
      borderWidth: 3
    }
  };
});

function changeActiveYear(year: number) {
  activeYear.value = stats.value.documents.years.find((y) => y.year === year)!;
}

const yearlyDocumentChartKey = ref(0);
const yearlyDocumentChart = computed(() => {
  yearlyDocumentChartKey.value += 1;

  return {
    labels: [translate('common.offer', 2), translate('common.invoice', 2)],
    dataset: {
      label: `${translate('chart.label')} ${activeYear.value.all}`,
      data: [activeYear.value.offers, activeYear.value.invoices],
      borderWidth: 3
    }
  };
});

watch(locale, () => {
  allTimeDocumentChartKey.value += 1;
  yearlyDocumentChartKey.value += 1;
});
</script>
