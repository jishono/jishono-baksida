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
            label: this.$t('statistikk.nye_aksepterte'),
            data: [],
            fill: false,
            borderColor: '#1565c0',
            backgroundColor: '#1565c0',
            borderWidth: 2
          },
          {
            label: this.$t('statistikk.nye_forslag'),
            data: [],
            fill: false,
            borderColor: 'red',
            backgroundColor: 'red',
            borderWidth: 2
          },
           {
            label: this.$t('kommentar.kommentarer'),
            data: [],
            fill: false,
            borderColor: 'orange',
            backgroundColor: 'orange',
            borderWidth: 2
          }
        ]
      },
      options: {
        interaction: {
          intersect: false
        },
        scales: {
          y: {
            beginAtZero: true,
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
            display: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },

  props: {
    nye_oversettelser: Array,
    nye_forslag: Array,
    antall_kommentarer: Array
  },

  methods: {
    getDateArray (start, end) {
      let array = []
      let date = new Date(start)
      while (date <= end) {
        let newDate = ''
        if (date.getDate().toString().length == 1) newDate += '0';
        newDate += (date.getDate()) + '-' + (date.getMonth() + 1)
        array.push(newDate)
        date.setDate(date.getDate() + 1);
      }
      return array;
    },
    genererChart () {
      const dateArray = this.getDateArray(new Date().setDate(new Date().getDate() - 30), new Date())
      const countobject1 = Object.fromEntries(this.nye_oversettelser.map(item => [item.dato, item.antall]));
      const countobject2 = Object.fromEntries(this.nye_forslag.map(item => [item.dato, item.antall]));
      const countobject3 = Object.fromEntries(this.antall_kommentarer.map(item => [item.dato, item.antall]));
      let oversettelser = []
      let forslag = []
      let kommentarer = []
      for (const dato of dateArray) {
        if (dato in countobject1) {
          oversettelser.push(countobject1[dato])
        } else {
          oversettelser.push(0)
        }
        if (dato in countobject2) {
          forslag.push(countobject2[dato])
        } else {
          forslag.push(0)
        }
         if (dato in countobject3) {
          kommentarer.push(countobject3[dato])
        } else {
          kommentarer.push(0)
        }
      }
      this.chartData = {
        labels: dateArray,
        datasets: [
          { ...this.chartData.datasets[0], data: oversettelser },
          { ...this.chartData.datasets[1], data: forslag },
          { ...this.chartData.datasets[2], data: kommentarer },
        ]
      }
    }
  },

  mounted () {
    this.genererChart()
  },
});
</script>
