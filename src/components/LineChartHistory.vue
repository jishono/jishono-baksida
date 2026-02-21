<template>
  <Line :data="chartData" :options="options" />
</template>

<script>
import { defineComponent } from 'vue';
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default defineComponent({
  components: { Line },

  data () {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: this.$t('statistikk.antall'),
            data: [],
            fill: false,
            borderColor: '#1565c0',
            backgroundColor: '#1565c0',
            borderWidth: 2,
            pointRadius: 0
          },
        ]
      },
      options: {
        interaction: {
          intersect: false
        },
        scales: {
          y: {
            suggestedMin: 3000,
            suggestedMax: 6000,
            grid: {
              display: true
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },

  props: {
    WordsWithTranslations: Array
  },

  methods: {
    getDateArray (start, end) {
      let array = []
      let date = start
      while (date <= end) {
        let newDate = ''
        newDate += ((date.getMonth() + 1) + '-' + date.getFullYear())
        array.push(newDate)
        date.setDate(date.getDate() + 1);
      }
      return array;
    },
    genererChart () {
      const startDate = new Date('2020-08-01')
      const dateArray = this.getDateArray(startDate, new Date().setDate(new Date().getDate() + 90))
      this.chartData = {
        labels: dateArray,
        datasets: [
          { ...this.chartData.datasets[0], data: this.WordsWithTranslations.map(word => word.antall) }
        ]
      }
    }
  },

  mounted () {
    this.genererChart()
  },
});
</script>
