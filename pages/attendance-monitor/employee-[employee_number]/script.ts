import { defineComponent } from 'vue'
import type { VisualizationModeOptionInterface } from '../../../resources/scripts/interfaces/VisualizationModeOptionInterface'
import AttendanceMonitorController from '../../../resources/scripts/controllers/AttendanceMonitorController'
import { DateTime } from 'luxon'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import AssistService from '~/resources/scripts/services/AssistService'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'


export default defineComponent({
  name: 'AttendanceMonitorByEmployee',
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
      { name: 'Annual', value: 'yearly', calendar_format: { mode: 'year', format: 'yy' }, selected: false },
      { name: 'Monthly', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false },
      { name: 'Weekly', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false },
    ] as VisualizationModeOptionInterface[],
    visualizationMode: null as VisualizationModeOptionInterface | null,
    periodSelected: new Date() as Date,
    maxDate: new Date() as Date,
    selectedEmployee: null as EmployeeInterface | null,
    filteredEmployees: [] as EmployeeInterface[],
    employee: null as EmployeeInterface | null,
    dailyAssistList: [] as AssistDayInterface[]
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
    weeklyStartDay () {
      const daysList =[]

      switch (this.visualizationMode?.value) {
        case 'monthly': {
          const date = DateTime.fromJSDate(this.periodSelected)
          const start = date.startOf('month')
          const daysInMonth = (start.daysInMonth || 0)
          
          for (let index = 0; index < daysInMonth; index++) {
            const currentDay = start.plus({ days: index })
            const year = parseInt(currentDay.toFormat('yyyy'))
            const month = parseInt(currentDay.toFormat('LL'))
            const day = parseInt(currentDay.toFormat('dd'))
  
            daysList.push({
              year,
              month,
              day
            })
          }
          break;
        }
        case 'weekly': {
          const date = DateTime.fromJSDate(this.periodSelected)
          const start = date.startOf('week')
          
          for (let index = 0; index < 7; index++) {
            const currentDay = start.plus({ days: index })
            const year = parseInt(currentDay.toFormat('yyyy'))
            const month = parseInt(currentDay.toFormat('LL'))
            const day = parseInt(currentDay.toFormat('dd'))
  
            daysList.push({
              year,
              month,
              day
            })
          }
          break;
        }
        default:
          break;
      }

      return daysList
    }
  },
  async mounted() {
    this.periodSelected = new Date()
    await this.getEmployee()
    await this.setDefaultVisualizationMode()
  },
  methods: {
    async getEmployee () {
      const employeCode = this.$route.params.employee_number
      const response = await new EmployeeService().getFilteredList(employeCode.toString(), null, null, 1, 1)
      const employee = response.status === 200 ? (response._data.data.employees.meta.total >= 1 ? response._data.data.employees.data[0] : null) : null
      this.employee = employee
    },
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
    async setPeriodData () {
      this.periodData.series = new AttendanceMonitorController().getDepartmentPeriodData(this.visualizationMode?.value || 'weekly', this.periodSelected)
      if (this.visualizationMode?.value === 'weekly') {
        await this.getEmployeeAssist()
      }
    },
    setPeriodCategories () {
      this.periodData.xAxis.categories = new AttendanceMonitorController().getDepartmentPeriodCategories(this.visualizationMode?.value || 'weekly', this.periodSelected)
    },
    setGraphsData () {
      this.setPeriodData()
      this.setPeriodCategories()
      this.setGeneralData()
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
    },
    async getEmployeeAssist () {
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      const startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
      const endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      const employeeID = this.employee?.employeeId || 0

      const assistReq = await new AssistService().index(startDay, endDay, employeeID, 1, 50)
      this.dailyAssistList = (assistReq.status === 200 ? assistReq._data.data.data.reverse() : []) as AssistDayInterface[]
    }
  }
})