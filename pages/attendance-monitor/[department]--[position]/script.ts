import { defineComponent } from 'vue'
import { DateTime } from 'luxon'

import AttendanceMonitorController from '~/resources/scripts/controllers/AttendanceMonitorController'

import type { VisualizationModeOptionInterface } from '~/resources/scripts/interfaces/VisualizationModeOptionInterface'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { EmployeeAssistStatisticInterface } from '~/resources/scripts/interfaces/EmployeeAssistStatisticInterface'

import EmployeeService from '~/resources/scripts/services/EmployeeService'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import PositionService from '~/resources/scripts/services/PositionService'
import AssistStatistic from '~/resources/scripts/models/AssistStatistic'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import AssistService from '~/resources/scripts/services/AssistService'


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
      // { name: 'Annual', value: 'yearly', calendar_format: { mode: 'year', format: 'yy' }, selected: true },
      { name: 'Monthly', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false },
      { name: 'Weekly', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false },
    ] as VisualizationModeOptionInterface[],
    visualizationMode: null as VisualizationModeOptionInterface | null,
    periodSelected: new Date() as Date,
    maxDate: new Date() as Date,
    minDate: new Date() as Date,
    employeeDepartmentPositionList: [] as EmployeeAssistStatisticInterface[],
    department: null as DepartmentInterface | null,
    position: null as PositionInterface | null,
    employeeList: [] as EmployeeInterface[],
    selectedEmployee: null as EmployeeInterface | null,
    filteredEmployees: [] as EmployeeInterface[]
  }),
  computed: {
    weeklyStartDay () {
      const daysList =[]

      if (!this.periodSelected) {
        return []
      }

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
    },
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
    await Promise.all([
      this.setDepartment(),
      this.setPositionDepartment(),
      this.setDepartmentPositionEmployeeList()
    ])
    await Promise.all(this.employeeDepartmentPositionList.map(emp => this.getEmployeeAssistCalendar(emp)))
    this.setGeneralData()
    this.setPeriodData()
  },
  methods: {
    async setDefaultVisualizationMode () {
      const index = this.visualizationModeOptions.findIndex(opt => opt.value === 'monthly')

      if (index >= 0) {
        this.visualizationMode = this.visualizationModeOptions[index]
      }

      await this.handlerVisualizationModeChange()
    },
    setGeneralData () {
      const assists = this.employeeDepartmentPositionList.reduce((acc, val) => acc + val.assistStatistics.onTimePercentage, 0)
      const tolerances = this.employeeDepartmentPositionList.reduce((acc, val) => acc + val.assistStatistics.onTolerancePercentage, 0)
      const delays = this.employeeDepartmentPositionList.reduce((acc, val) => acc + val.assistStatistics.onDelayPercentage, 0)
      const faults = this.employeeDepartmentPositionList.reduce((acc, val) => acc + val.assistStatistics.onFaultPercentage, 0)
      const totalAvailable = assists + tolerances + delays + faults
      const serieData = []

      const assist = Math.round((assists / totalAvailable) * 100)
      const tolerance = Math.round((tolerances / totalAvailable) * 100)
      const delay = Math.round((delays / totalAvailable) * 100)
      const fault = Math.round((faults / totalAvailable) * 100)

      serieData.push({ name: 'On time', y: assist, color: '#33D4AD' })
      serieData.push({ name: 'Tolerances', y: tolerance, color: '#3CB4E5' })
      serieData.push({ name: 'Delays', y: delay, color: '#FF993A' })
      serieData.push({ name: 'Faults', y: fault, color: '#d45633' })

      this.generalData.series[0].data = serieData
    },
    setPeriodData () {
      let periodLenght = 12

      const monthPerdiod = parseInt(DateTime.fromJSDate(this.periodSelected).toFormat('LL'))
      const yearPeriod = parseInt(DateTime.fromJSDate(this.periodSelected).toFormat('yyyy'))
      const dayPeriod = parseInt(DateTime.fromJSDate(this.periodSelected).toFormat('dd'))
      let start

      switch (this.visualizationMode?.value) {
        case 'monthly': {
          const date = DateTime.local(yearPeriod, monthPerdiod, 1)
          const days = date.daysInMonth
          start = date.startOf('month')
          periodLenght = days || 0
          break
        }
        case 'weekly':
          const date = DateTime.local(yearPeriod, monthPerdiod, dayPeriod)
          start = date.startOf('week')
          periodLenght = 7
          break
        default:
          periodLenght = 0
          break
      }

      const dayStatisticsCollection: any = []

      if (start) {
        for (let index = 0; index < periodLenght; index++) {
          const currentDay = start.plus({ days: index })
          const year = parseInt(currentDay.toFormat('yyyy'))
          const month = parseInt(currentDay.toFormat('LL'))
          const day = parseInt(currentDay.toFormat('dd'))
          const evalDate = `${year}-${`${month}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`
          let dayCalendar: any[] = []
  
          this.employeeDepartmentPositionList.forEach(item => {
            const currentCalendar: AssistDayInterface[] = item.calendar.filter(calendar => calendar.day === evalDate)
            if (currentCalendar.length > 0) {
              dayCalendar.push(currentCalendar[0].assist)
            }
          })
  
          dayStatisticsCollection.push({
            day: evalDate,
            assist: dayCalendar
          })
        }
  
        const assistSerie: number[] = []
        const toleranceSerie: number[] = []
        const delaySerie: number[] = []
        const faultSerie: number[] = []
  
        dayStatisticsCollection.forEach((element: any) => {
          const assists = element.assist.filter((assistDate: any) => assistDate.checkInStatus === 'ontime').length
          const tolerances = element.assist.filter((assistDate: any) => assistDate.checkInStatus === 'tolerance').length
          const delays = element.assist.filter((assistDate: any) => assistDate.checkInStatus === 'delay').length
          const faults = element.assist.filter((assistDate: any) => assistDate.checkInStatus === 'fault' && !assistDate.isFutureDay && !assistDate.isRestDay).length
          const totalAvailable = assists + tolerances + delays + faults
  
          const assist = Math.round((assists / totalAvailable) * 100)
          const tolerance = Math.round((tolerances / totalAvailable) * 100)
          const delay = Math.round((delays / totalAvailable) * 100)
          const fault = Math.round((faults / totalAvailable) * 100)
  
          assistSerie.push(Number.isNaN(assist) ? 0 : assist)
          toleranceSerie.push(Number.isNaN(tolerance) ? 0 : tolerance)
          delaySerie.push(Number.isNaN(delay) ? 0 : delay)
          faultSerie.push(Number.isNaN(fault) ? 0 : fault)
        });
  
        
        const serieData = []
  
        serieData.push({ name: 'On time', data: assistSerie, color: '#33D4AD' })
        serieData.push({ name: 'Tolerances', data: toleranceSerie, color: '#3CB4E5' })
        serieData.push({ name: 'Delays', data: delaySerie, color: '#FF993A' })
        serieData.push({ name: 'Faults', data: faultSerie, color: '#d45633' })
  
        this.periodData.series = serieData
        this.setPeriodCategories()
      }
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
      const employeeDepartmentPositionList = (response.status === 200 ? response._data.data.employees.data : []) as EmployeeInterface[]
      this.employeeDepartmentPositionList = employeeDepartmentPositionList.map((employee) => ({ employee, assistStatistics: new AssistStatistic().toModelObject(), calendar: [] }))

      await Promise.all(this.employeeDepartmentPositionList.map(emp => this.getEmployeeAssistCalendar(emp)))
    },
    async getEmployeeAssistCalendar (employee: EmployeeAssistStatisticInterface) {
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      const startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
      const endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      const employeeID = employee?.employee?.employeeId || 0

      try {
        const assistReq = await new AssistService().index(startDay, endDay, employeeID)
        const employeeCalendar = (assistReq.status === 200 ? assistReq._data.data.employeeCalendar : []) as AssistDayInterface[]
        employee.calendar = employeeCalendar
        this.setGeneralStatisticsData(employee, employee.calendar)
      } catch (error) {
      }
    },
    setGeneralStatisticsData (employee: EmployeeAssistStatisticInterface, employeeCalendar: AssistDayInterface[]) {
      const assists = employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'ontime').length
      const tolerances = employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'tolerance').length
      const delays = employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'delay').length
      const faults = employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'fault' && !assistDate.assist.isFutureDay && !assistDate.assist.isRestDay).length
      const totalAvailable = assists + tolerances + delays + faults

      const assist = Math.round((assists / totalAvailable) * 100)
      const tolerance = Math.round((tolerances / totalAvailable) * 100)
      const delay = Math.round((delays / totalAvailable) * 100)
      const fault = Math.round((faults / totalAvailable) * 100)

      const assistStatistics = {
        onTimePercentage: assist,
        onTolerancePercentage: tolerance,
        onDelayPercentage: delay,
        onFaultPercentage: fault,
      }

      employee.assistStatistics = assistStatistics
    },
    async handlerVisualizationModeChange () {
      const idx = this.visualizationModeOptions.findIndex(mode => mode.value === this.visualizationMode?.value)
      this.visualizationModeOptions.forEach(mode => mode.selected = false)

      if (idx >= 0) {
        this.visualizationModeOptions[idx].selected =  true
      }

      this.periodSelected = new Date()
    },
    async onInputVisualizationModeChange () {
      this.handlerVisualizationModeChange()
      await Promise.all(this.employeeDepartmentPositionList.map(emp => this.getEmployeeAssistCalendar(emp)))
      this.setGeneralData()
      this.setPeriodData()
    },
    async handlerPeriodChange () {
      await Promise.all(this.employeeDepartmentPositionList.map(emp => this.getEmployeeAssistCalendar(emp)))
      this.setGeneralData()
      this.setPeriodData()
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
    onEmployeStatisticsChange (newStatistcs: EmployeeAssistStatisticInterface) {
      // const employeeIdx = this.employeeDepartmentPositionList.findIndex(assist => assist.employee.employeeId === newStatistcs.employee.employeeId)
      // if (employeeIdx >= 0) {
      //   this.employeeDepartmentPositionList[employeeIdx].assistStatistics = newStatistcs.assistStatistics
      //   this.employeeDepartmentPositionList[employeeIdx].calendar = newStatistcs.calendar
        // this.setGeneralData()
        // this.setPeriodData()
      // }
    }
  }
})
