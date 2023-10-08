<script setup lang="ts">
const { t } = useI18n();
const store = useStatisticStore();
const { statistics } = storeToRefs(store);
const { formatToEur } = useCurrencyHelper();

function formatToString(value: number): string {
  return value.toString();
}
await store.getStats();

const { transform, invoiceToolTip, mainTabs, yearTabs } = useChartData(
  statistics.value.documents.years,
);

const activeTab = ref('');
const yearTab = ref('');
const chartData = computed(() => {
  return transform(activeTab.value, yearTab.value);
});

const chartOptions = computed(() => {
  const baseOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (item: any) => {
            const info = `${item.dataset.label}: ${item.formattedValue}`;
            return item.datasetIndex === 1
              ? info
              : [info, ...invoiceToolTip(item, activeTab.value, yearTab.value)];
          },
        },
      },
    },
  };
  return activeTab.value === 'MONTHLY'
    ? {
        ...baseOptions,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      }
    : {
        ...baseOptions,
        scales: {
          x: {
            stacked: false,
          },
          y: {
            stacked: false,
          },
        },
      };
});

useHead({
  title: t('DASHBOARD.TITLE'),
});
</script>

<template>
  <BasePage title="DASHBOARD.TITLE">
    <div class="flex flex-col gap-16">
      <div class="flex flex-col gap-12">
        <StatisticGroup title="DASHBOARD.STATS.FINANCE.TITLE">
          <StatisticItem
            label="DASHBOARD.STATS.FINANCE.REVENUES"
            :value="formatToEur(statistics.documents.allTime.revenues)"
            :hidden="true"
          />
          <StatisticItem
            label="DASHBOARD.STATS.FINANCE.TAXES"
            :value="formatToEur(statistics.documents.allTime.taxes)"
            :hidden="true"
          />
          <StatisticItem
            label="DASHBOARD.STATS.FINANCE.TOTAL_REVENUES"
            :value="formatToEur(statistics.documents.allTime.totalRevenues)"
            :hidden="true"
          />
        </StatisticGroup>

        <div class="grid grid-cols-2 divide-x">
          <StatisticGroup title="DASHBOARD.STATS.CLIENT.TITLE">
            <StatisticItem
              label="DASHBOARD.STATS.CLIENT.ALL"
              :value="formatToString(statistics.clients.all)"
            />
            <StatisticItem
              label="DASHBOARD.STATS.CLIENT.PRIVATE"
              :value="formatToString(statistics.clients.privates)"
            />
            <StatisticItem
              label="DASHBOARD.STATS.CLIENT.COMPANY"
              :value="formatToString(statistics.clients.companies)"
            />
          </StatisticGroup>
          <StatisticGroup title="DASHBOARD.STATS.DOCUMENT.TITLE">
            <StatisticItem
              label="DASHBOARD.STATS.DOCUMENT.ALL"
              :value="formatToString(statistics.documents.allTime.all)"
            />
            <StatisticItem
              label="DASHBOARD.STATS.DOCUMENT.OFFER"
              :value="formatToString(statistics.documents.allTime.offers)"
            />
            <StatisticItem
              label="DASHBOARD.STATS.DOCUMENT.INVOICES"
              :value="formatToString(statistics.documents.allTime.invoices)"
            />
          </StatisticGroup>
        </div>
      </div>
      <hr class="h-px border-0 bg-gray-200 dark:bg-gray-700" />
      <div class="flex flex-col gap-4">
        <StatisticChartTabs
          v-model="activeTab"
          :tabs="mainTabs"
          :translate="true"
        />
        <StatisticChartTabs
          v-if="activeTab !== 'YEARLY'"
          v-model="yearTab"
          :tabs="yearTabs"
        />
        <StatisticChartBar :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </BasePage>
</template>
