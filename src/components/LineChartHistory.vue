<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
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
        tooltips: {
          intersect: false
        },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 3000,
              suggestedMax: 6000
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: false
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
      this.chartData.datasets[0].data = this.WordsWithTranslations.map(word => word.antall)
      this.chartData.labels = dateArray
    }
  },
  mounted () {
    this.genererChart()
    this.renderChart(this.chartData, this.options)
  }
}
</script>