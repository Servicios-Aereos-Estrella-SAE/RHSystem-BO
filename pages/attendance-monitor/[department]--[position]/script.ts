import { defineComponent } from 'vue'
import { DateTime } from 'luxon'

import AttendanceMonitorController from '~/resources/scripts/controllers/AttendanceMonitorController'

import type { VisualizationModeOptionInterface } from '~/resources/scripts/interfaces/VisualizationModeOptionInterface'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import PositionService from '~/resources/scripts/services/PositionService'


export default defineComponent({
  name: 'AttendanceMonitorPosition',
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
    visualizationModeOptions: [
      { name: 'Annual', value: 'yearly', calendar_format: { mode: 'year', format: 'yy' }, selected: true },
      { name: 'Monthly', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false },
      { name: 'Weekly', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false },
    ] as VisualizationModeOptionInterface[],
    visualizationMode: null as VisualizationModeOptionInterface | null,
    periodSelected: new Date() as Date,
    maxDate: new Date() as Date,
    minDate: new Date() as Date,
    employeeDepartmentPositionList: [] as EmployeeInterface[],
    department: null as DepartmentInterface | null,
    position: null as PositionInterface | null,
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
  },
  created () {
    const minDateString = '2024-05-01T00:00:00'
    const minDate = new Date(minDateString)
    this.minDate = minDate
  },
  async mounted() {
    this.periodSelected = new Date()
    this.setDefaultVisualizationMode()
    await this.setDepartment()
    await this.setPositionDepartment()
    await this.setDepartmentPositionEmployeeList()
  },
  methods: {
    setDefaultVisualizationMode () {
      const index = this.visualizationModeOptions.findIndex(opt => opt.value === 'weekly')

      if (index >= 0) {
        this.visualizationMode = this.visualizationModeOptions[index]
      }

      this.handlerVisualizationModeChange()
    },
    setGeneralData () {
      this.generalData.series[0].data = new AttendanceMonitorController().getDepartmentTotalData(this.visualizationMode?.value || 'weekly')
    },
    setPeriodData () {
      this.periodData.series = new AttendanceMonitorController().getDepartmentPeriodData(this.visualizationMode?.value || 'weekly', this.periodSelected)
    },
    setPeriodCategories () {
      this.periodData.xAxis.categories = new AttendanceMonitorController().getDepartmentPeriodCategories(this.visualizationMode?.value || 'weekly', this.periodSelected)
    },
    async setDepartment () {
      const departmentId = parseInt(`${this.$route.params.department || 0}`)
      const response = await new DepartmentService().show(departmentId)
      this.department = response.status === 200 ? response._data.data.department : null
    },
    async setPositionDepartment () {
      const departmentId = parseInt(`${this.$route.params.department || 0}`)
      const positionId = parseInt(`${this.$route.params.position || 0}`)
      const response = await new PositionService().show(departmentId, positionId)
      this.position = response.status === 200 ? response._data.data.position : null
    },
    async setDepartmentPositionEmployeeList () {
      const departmentId = parseInt(`${this.$route.params.department || 0}`)
      const positionId = parseInt(`${this.$route.params.position || 0}`)
      const response = await new EmployeeService().getFilteredList('', departmentId, positionId, 1, 99999999999)
      this.employeeDepartmentPositionList = response.status === 200 ? response._data.data.employees.data : []
    },
    setGraphsData () {
      this.setPeriodData()
      this.setPeriodCategories()
      this.setGeneralData()
    },
    async handlerDeparmentSelect () {
      this.periodSelected = new Date()
      await this.setDepartmentPositionEmployeeList()
      this.setGraphsData()
    },
    handlerVisualizationModeChange () {
      const idx = this.visualizationModeOptions.findIndex(mode => mode.value === this.visualizationMode?.value)
      this.visualizationModeOptions.forEach(mode => mode.selected = false)

      if (idx >= 0) {
        this.visualizationModeOptions[idx].selected =  true
      }

      this.periodSelected = new Date()
      this.setGraphsData()
    },
    handlerPeriodChange () {
      this.setGraphsData()
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
    }
  }
})