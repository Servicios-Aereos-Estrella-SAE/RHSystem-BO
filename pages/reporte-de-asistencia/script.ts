import { defineComponent } from 'vue'
import type VisualizationModeOptionInterface from '~/resources/scripts/interfaces/VisualizationModeOptionInterface'
import AttendanceMonitorController from '~/resources/scripts/controllers/AttendanceMonitorController'
import { DateTime } from 'luxon'


export default defineComponent({
  name: 'ReporteAsistencia',
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
        type: 'column',
        scrollablePlotArea: {
          minWidth: 1024,
          scrollPositionX: 1
        }
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
    maxDate: new Date() as Date,
    departmentPositionList: [] as any
  }),
  computed: {
    lineChartTitle () {
      if (this.visualizationMode.value === 'yearly') {
        const date = DateTime.fromJSDate(this.periodSelected).setLocale('es')
        return `Comportamiento mensual en el año ${date.toFormat('yyyy')}`
      }

      if (this.visualizationMode.value === 'monthly') {
        const date = DateTime.fromJSDate(this.periodSelected).setLocale('es')
        return `Comportamiento en ${date.toFormat('MMMM').toUpperCase()}, ${date.toFormat('yyyy')}`
      }

      if (this.visualizationMode.value === 'weekly') {
        return 'Comportamiento en la semana'
      }
    }
  },
  async mounted() {
    this.periodSelected = new Date()
    this.setGraphsData()
    await this.setDepartmentPositions()
  },
  methods: {
    setGeneralData () {
      this.generalData.series[0].data = new AttendanceMonitorController().getDepartmentTotalData(this.visualizationMode.value)
    },
    setPeriodData () {
      this.periodData.series = new AttendanceMonitorController().getDepartmentPeriodData(this.visualizationMode.value, this.periodSelected)
    },
    setPeriodCategories () {
      this.periodData.xAxis.categories = new AttendanceMonitorController().getDepartmentPeriodCategories(this.visualizationMode.value, this.periodSelected)
    },
    async setDepartmentPositions () {
      const response = await new AttendanceMonitorController().getDepartmentPositions()
      this.departmentPositionList = response
    },
    setGraphsData () {
      this.setPeriodData()
      this.setPeriodCategories()
      this.setGeneralData()
    },
    async handlerDeparmentSelect () {
      this.periodSelected = new Date()
      await this.setDepartmentPositions()
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
    }
  }
})