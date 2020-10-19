<script>
  import { Line } from 'vue-chartjs'
  import headacheAPI from '@/api/headache'  
  import getUnique from '@/helpers/getUnique'
  import moment from 'moment' 
  export default {
    extends: Line,
     props: ['all_frequency_pain','currentType','memberId'],
    data () {
      return {
        days:[],
        chartData: {
          datasets: [
            {
              data: [  ],
              fill: false,
              borderColor: '#36BE78',
              backgroundColor: '#36BE78',
              borderWidth: 3,
            }
          ]
        },
        options: {
          responsive: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              },
            }],
            xAxes: [ {
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: false
          },
          maintainAspectRatio: false
        }
      }
    },
    computed: {
    },
    methods: {
      callabels(){
          switch (this.currentType.value) {
                case 1:
                  const dayInMonth = Array.from(Array(moment().daysInMonth(1,'days')), (_, i) => i+1 )
                    this.chartData.labels = dayInMonth
                   break;
                case 2:
                  this.chartData.labels =  [ 2, 1, 0 ].map((array) => {
                    return moment().subtract(array * 1, 'month').add(543, 'year').format('MMMM YYYY')
                  })
                 break;
                case 3:
                  this.chartData.labels =  [ 5, 4, 3, 2, 1, 0 ].map((array) => {
                      return moment().subtract(array * 1, 'month').format('MMM')
                  })
                  break;
            }
      },
      calDataSets(){
        console.log('all_frequency_pain :: ')
        switch (this.currentType.value) {
              case 1:
                    console.log(this.all_frequency_pain)
                    this.chartData.datasets[0].data =  this.all_frequency_pain['all30']
                    break;
              case 2:
                    console.log(this.all_frequency_pain)
                    this.chartData.datasets[0].data =  this.all_frequency_pain['all90']
                    break;
              case 3:
                    console.log(this.all_frequency_pain)
                    this.chartData.datasets[0].data =  this.all_frequency_pain['all180']
                    break;
         }
      }
    },
    watch: {
        currentType() {
          this.callabels()
          this.calDataSets()
          this.renderChart(this.chartData, this.options)
        }
      },
      mounted () {
        this.callabels()
        this.calDataSets()
        this.renderChart(this.chartData, this.options)
      }
  }
</script>