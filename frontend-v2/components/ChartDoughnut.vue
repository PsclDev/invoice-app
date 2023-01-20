<template>
  <canvas ref="chartCanvas" />
</template>

<script lang="ts" setup>
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { PropType } from "vue";
import { ChartInterface } from "~/types";

const props = defineProps({
  chartData: {
    type: Object as PropType<ChartInterface>,
    required: true,
  },
});

const { chartData } = toRefs(props);
const chart = ref<Chart>();
const colorMode = useColorMode();

Chart.register(...registerables);
const chartCanvas = ref<HTMLCanvasElement>();

onMounted(() => {
  let ctx = chartCanvas.value!.getContext("2d")!;
  chart.value = new Chart(ctx, {
    type: "doughnut",
    plugins: [ChartDataLabels],
    data: {
      labels: chartData!.value!.labels,
      datasets: [
        {
          ...chartData!.value!.dataset,
          backgroundColor: ["#bef264", "#34d399"],
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          color: "#000",
          font: {
            family: "'Barlow', 'sans-serif'",
            weight: "bold",
          },
          textAlign: "center",
          rotation: -45,
          formatter: function (value, context) {
            return `${value}\n${context.chart.data.labels![context.dataIndex]}`;
          },
        },
        legend: {
          display: false,
          labels: {
            font: {
              family: "'Barlow', 'sans-serif'",
            },
          },
        },
      },
    },
  });
});
</script>
