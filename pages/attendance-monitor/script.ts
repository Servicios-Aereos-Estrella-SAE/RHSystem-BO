import { defineComponent } from 'vue'
import { DateTime } from 'luxon'

import AttendanceMonitorController from '~/resources/scripts/controllers/AttendanceMonitorController'

import type { VisualizationModeOptionInterface } from '~/resources/scripts/interfaces/VisualizationModeOptionInterface'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'


export default defineComponent({
  name: 'AttendanceMonitorByDepartment',
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
    departmentList: [] as DepartmentInterface[],
    departmenSelected: null as DepartmentInterface | null,
    visualizationModeOptions: [
      { name: 'Annual', value: 'yearly', calendar_format: { mode: 'year', format: 'yy' }, selected: true },
      { name: 'Monthly', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false },
      { name: 'Weekly', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false },
    ] as VisualizationModeOptionInterface[],
    visualizationMode: null as VisualizationModeOptionInterface | null,
    periodSelected: new Date() as Date,
    minDate: new Date() as Date,
    maxDate: new Date() as Date,
    departmentPositionList: [] as PositionInterface[],
    employeeList: [] as EmployeeInterface[],
    selectedEmployee: null as EmployeeInterface | null,
    filteredEmployees: [] as EmployeeInterface[]
  }),
  computed: {
    lineChartTitle () {
      if (this.visualizationMode?.value === 'yearly') {
        const date = DateTime.fromJSDate(this.periodSelected).setLocale('en')
        return `Monthly behavior by the year, ${date.toFormat('yyyy')}`
      }

      if (this.visualizationMode?.value === 'monthly') {
        const date = DateTime.fromJSDate(this.periodSelected).setLocale('en')
        return `Behavior in ${date.toFormat('MMMM')}, ${date.toFormat('yyyy')}`
      }

      if (this.visualizationMode?.value === 'weekly') {
        return 'Weekly behavior'
      }
    },
    departmentCollection (): DepartmentInterface[] {
      const list: DepartmentInterface[] = JSON.parse(JSON.stringify(this.departmentList)) as DepartmentInterface[]
      const collection = list.map((item: DepartmentInterface) => ({ ...item, label: item.departmentAlias || item.departmentName }))
      return collection
    },
    departmentPositionCollection (): PositionInterface[] {
      const list: PositionInterface[] = JSON.parse(JSON.stringify(this.departmentPositionList)) as PositionInterface[]
      const collection = list.map((item: PositionInterface) => item)
      return collection
    }
  },
  created () {
    const minDateString = '2024-05-01T00:00:00'
    const minDate = new Date(minDateString)
    this.minDate = minDate
  },
  async mounted() {
    this.periodSelected = new Date()

    await this.handlerSetInitialDepartmentList()
    await this.setDepartmentPositions()
    await this.setDefaultVisualizationMode()
  },
  methods: {
    setDefaultVisualizationMode () {
      const index = this.visualizationModeOptions.findIndex(opt => opt.value === 'weekly')

      if (index >= 0) {
        this.visualizationMode = this.visualizationModeOptions[index]
      }

      this.handlerVisualizationModeChange()
    },
    async setGraphsData () {
      await this.setPeriodData()
      await this.setPeriodCategories()
      await this.setGeneralData()
    },
    async setPeriodData () {
      this.periodData.series = await new AttendanceMonitorController().getDepartmentPeriodData(this.visualizationMode?.value || 'weekly', this.periodSelected)
    },
    async setPeriodCategories () {
      this.periodData.xAxis.categories = await new AttendanceMonitorController().getDepartmentPeriodCategories(this.visualizationMode?.value || 'weekly', this.periodSelected)
    },
    async setGeneralData () {
      this.generalData.series[0].data = await new AttendanceMonitorController().getDepartmentTotalData(this.visualizationMode?.value || 'weekly')
    },
    async setDepartmetList () {
      const response = await  new DepartmentService().getAllDepartmentList()
      this.departmentList = response.status === 200 ? response._data.data.departments : []
    },
    async setDepartmentPositions () {
      const response = await new DepartmentService().getDepartmentPositions(this.departmenSelected?.departmentId || 0)
      this.departmentPositionList = response.status === 200 ? response._data.data.positions : []
    },
    async handlerSetInitialDepartmentList () {
      await this.setDepartmetList()
      this.departmenSelected = this.departmentCollection.length > 0 ? this.departmentCollection[0] : null
    },
    async handlerDeparmentSelect () {
      this.periodSelected = new Date()
      await this.setGraphsData()
      await this.setDepartmentPositions()
    },
    async handlerVisualizationModeChange () {
      const idx = this.visualizationModeOptions.findIndex(mode => mode.value === this.visualizationMode?.value)
      this.visualizationModeOptions.forEach(mode => mode.selected = false)

      if (idx >= 0) {
        this.visualizationModeOptions[idx].selected =  true
      }

      this.periodSelected = new Date()
      await this.setGraphsData()
    },
    async handlerPeriodChange () {
      await this.setGraphsData()
    },
    async handlerSearchEmployee(event: any) {
      if (event.query.trim().length) {
        const response = await new EmployeeService().getFilteredList(event.query.trim(), null, null, 1, 30)
        const list = response.status === 200 ? response._data.data.employees.data : []
        this.filteredEmployees = list
      }
    },
    onEmployeeSelect () {
      if (this.selectedEmployee && this.selectedEmployee.employeeCode) {
        this.$router.push(`/attendance-monitor/employee-${this.selectedEmployee.employeeCode}`)
      }
    },
  }
})