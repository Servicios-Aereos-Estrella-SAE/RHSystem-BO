import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type VisualizationModeOptionInterface from '~/resources/scripts/interfaces/VisualizationModeOptionInterface'
import AttendanceMonitorService from '~/resources/scripts/services/AttendanceMonitorService'

interface IChartSerie {
  name: string,
  data: [],
  color: string
}

export default defineComponent({
  props: {
  },
  data: () => ({
    generalData: {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: '',
        align: 'left'
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Asistencia',
        colorByPoint: true,
        data: [] as Array<Object>
      }]
    },
    periodData: {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: [] as string[]
      },
      yAxis: {
        title: {
          text: ''
        },
        min: 0,
        max: 100
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b><br/>',
        valueSuffix: '%',
        shared: false
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          allowPointSelect: true,
          cursor: 'pointer',
          enableMouseTracking: true,
        }
      },
      series: [] as Array<Object>
    },
    departmentCollection: [
      { name: 'Administración', slug: 'administracion' },
      { name: 'Sistemas', slug: 'sistemas' },
      { name: 'Handling', slug: 'handling' },
      { name: 'Taxi Áereo', slug: 'taxi-aereo' },
    ],
    departmenSelected: { name: 'Taxi Áereo', slug: 'taxi-aereo' },
    visualizationModeOptions: [
      { name: 'Anual', value: 'yearly', calendar_format: { mode: 'year', format: 'yy' }, selected: true },
      { name: 'Mensual', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false },
      { name: 'Semanal', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false },
    ] as VisualizationModeOptionInterface[],
    visualizationMode: { name: 'Anual', value: 'yearly', calendar_format: { mode: 'year', format: 'yy' }, selected: true } as VisualizationModeOptionInterface,
    periodSelected: new Date() as Date,
    maxDate: new Date() as Date
  }),
  computed: {
    lineChartTitle () {
      if (this.visualizationMode.value === 'yearly') {
        return 'Comportamiento por meses del año'
      }

      if (this.visualizationMode.value === 'monthly') {
        return 'Comportamiento en el mes'
      }

      if (this.visualizationMode.value === 'weekly') {
        return 'Comportamiento en la semana'
      }
    }
  },
  mounted() {
    this.periodSelected = new Date()
    this.setGraphsData()
  },
  methods: {
    setGeneralData () {
      this.generalData.series[0].data = new AttendanceMonitorService().getDepartmentTotalData(this.visualizationMode.value)
    },
    setPeriodData () {
      this.periodData.series = new AttendanceMonitorService().getDepartmentPeriodData(this.visualizationMode.value, this.periodSelected)
    },
    setPeriodCategories () {
      this.periodData.xAxis.categories = new AttendanceMonitorService().getDepartmentPeriodCategories(this.visualizationMode.value, this.periodSelected)
    },
    setGraphsData () {
      this.setPeriodData()
      this.setPeriodCategories()
      this.setGeneralData()
    },
    handlerDeparmentSelect () {
      this.periodSelected = new Date()
      this.setGraphsData()
    },
    handlerVisualizationModeChange () {
      const idx = this.visualizationModeOptions.findIndex(mode => mode.value === this.visualizationMode.value)
      this.visualizationModeOptions.forEach(mode => mode.selected = false)

      if (idx >= 0) {
        this.visualizationModeOptions[idx].selected =  true
      }

      this.periodSelected = new Date()
      this.setGraphsData()
    },
    handlerPeriodChange () {
      this.setGraphsData()

      const date = DateTime.fromJSDate(this.periodSelected)
      const selectedDay = date.toFormat('D')
      console.log('🚀 ---------------------------------------------------🚀')
      console.log('🚀 ~ handlerPeriodChange ~ selectedDay:', selectedDay)
      console.log('🚀 ---------------------------------------------------🚀')
      const start = date.startOf('week')
      console.log('🚀 ---------------------------------------🚀')
      console.log('🚀 ~ handlerPeriodChange ~ start:', start.toFormat('D'))
      console.log('🚀 ---------------------------------------🚀')
      const end = date.endOf('week')
      console.log('🚀 -----------------------------------🚀')
      console.log('🚀 ~ handlerPeriodChange ~ end:', end.toFormat('D'))
      console.log('🚀 -----------------------------------🚀')
    }
  }
})