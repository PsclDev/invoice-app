<template>
  <div class="flex flex-col justify-center">
    <template v-if="error"> <Error :error="error" /> </template>
    <template v-else-if="stats">
      <div class="text-5xl text-center">Dashboard</div>
      <div class="text-xl text-center mt-2">
        Updated today, at {{ updatedAt }}
      </div>

      <div class="mt-16">
        <div class="text-4xl text-center">All-Time Stats</div>
        <div class="flex gap-24 mt-5 justify-center">
          <div class="w-56 h-56">
            <ChartDoughnut :chart-data="clientsChart" />
          </div>
          <div class="w-56 h-56">
            <ChartDoughnut :chart-data="allTimeDocumentChart" />
          </div>
        </div>
        <div class="flex justify-center gap-10 mt-8">
          <div class="text-2xl">
            Revenue: {{ stats.documents.allTime.revenues.toFixed(2) }}€
          </div>
          <div class="text-2xl">
            Tax: {{ stats.documents.allTime.taxes.toFixed(2) }}€
          </div>
          <div class="text-2xl">
            Total Revenue:
            {{ stats.documents.allTime.totalRevenues.toFixed(2) }}€
          </div>
        </div>
      </div>

      <div class="mt-16">
        <div class="text-4xl text-center">Yearly Stats</div>
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
          <div class="flex flex-col gap-5">
            <div class="text-2xl">Revenue: {{ activeYear.revenues }}€</div>
            <div class="text-2xl">Tax: {{ activeYear.revenues }}€</div>
            <div class="text-2xl">
              Total Revenue: {{ activeYear.revenues }}€
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

const statsStore = useStatsStore();
const { stats, error } = storeToRefs(statsStore);
statsStore.getStats();

const updatedAt = computed(() => {
  return DateTime.fromJSDate(stats.value.updatedAt).toLocaleString(
    DateTime.TIME_24_SIMPLE
  );
});

const clientsChart = computed(() => {
  return {
    labels: ['Private', 'Company'],
    dataset: {
      label: `Out of ${stats.value.clients.all}`,
      data: [stats.value.clients.privates, stats.value.clients.companies],
      borderWidth: 3,
    },
  };
});

const activeYear = ref<DocumentYearStatsInterface>(
  {} as DocumentYearStatsInterface
);

const allTimeDocumentChart = computed(() => {
  activeYear.value =
    stats.value.documents.years[stats.value.documents.years.length - 1];

  return {
    labels: ['Offers', 'Invoices'],
    dataset: {
      label: `Out of ${stats.value.documents.allTime.all}`,
      data: [
        stats.value.documents.allTime.offers,
        stats.value.documents.allTime.invoices,
      ],
      borderWidth: 3,
    },
  };
});

function changeActiveYear(year: number) {
  activeYear.value = stats.value.documents.years.find((y) => y.year === year)!;
}

const yearlyDocumentChartKey = ref(0);
const yearlyDocumentChart = computed(() => {
  yearlyDocumentChartKey.value += 1;

  return {
    labels: ['Offers', 'Invoices'],
    dataset: {
      label: `Out of ${activeYear.value.all}`,
      data: [activeYear.value.offers, activeYear.value.invoices],
      borderWidth: 3,
    },
  };
});
</script>
