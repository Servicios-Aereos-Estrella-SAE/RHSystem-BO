import { defineComponent } from 'vue'
import { DateTime } from 'luxon'
import moment from 'moment';
import AttendanceMonitorController from '~/resources/scripts/controllers/AttendanceMonitorController'

import type { VisualizationModeOptionInterface } from '~/resources/scripts/interfaces/VisualizationModeOptionInterface'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import type { EmployeeAssistStatisticInterface } from '~/resources/scripts/interfaces/EmployeeAssistStatisticInterface'
import AssistStatistic from '~/resources/scripts/models/AssistStatistic'
import AssistService from '~/resources/scripts/services/AssistService'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import { useMyGeneralStore } from '~/store/general'
import type { AssistSyncStatus } from '~/resources/scripts/interfaces/AssistSyncStatus'
import type { AssistStatisticInterface } from '~/resources/scripts/interfaces/AssistStatisticInterface';
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface';
import AssistExcelService from '~/resources/scripts/services/AssistExcelService';
import type { AssistExcelFilterIncidentSummaryPayRollInterface } from '~/resources/scripts/interfaces/AssistExcelFilterIncidentSummaryPayRollInterface';
import EmployeeAssistCalendarService from '~/resources/scripts/services/EmployeeAssistCalendarService';
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService';

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
      { name: 'Custom', value: 'custom', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false, number_months: 1 },
      { name: 'Monthly', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false },
      { name: 'Weekly', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false },
      { name: 'Fourteen', value: 'fourteen', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false, number_months: 1 },
    ] as VisualizationModeOptionInterface[],
    statusList: [{ name: 'All' }, { name: 'Faults' }, { name: 'Delays' }, { name: 'Tolerances' }, { name: 'On time' }, { name: 'Early outs' }] as Array<Object>,
    statusSelected: null as string | null,
    visualizationMode: null as VisualizationModeOptionInterface | null,
    periodSelected: new Date() as Date,
    datesSelected: [] as Date[],
    minDate: new Date() as Date,
    maxDate: new Date() as Date,
    departmentPositionList: [] as PositionInterface[],
    employeeList: [] as EmployeeInterface[],
    selectedEmployee: null as EmployeeInterface | null,
    filteredEmployees: [] as EmployeeInterface[],
    employeeDepartmentList: [] as EmployeeAssistStatisticInterface[],
    statusInfo: null as AssistSyncStatus | null,
    rotationIndex: null as number | null,
    datePay: '' as string,
    onSyncStatus: true,
    departmentID: '' as string,
    disabledNoPaymentDates: [] as Date[],
    drawerVacations: false,
    vacationDateStart: '',
    vacationDateEnd: '',
    currentDepartmentId: null as number | null,
    employeesWithOutShift: [] as EmployeeInterface[],
    drawerEmployeeWithOutShift: false,
    canSeeConsecutiveFaults: false,
    drawerEmployeeWithFaults: false,
    employeesWithFaults: [] as EmployeeInterface[],
    employeeDiscrimitorsList: [] as EmployeeAssistStatisticInterface[],
    searchTime: null as null | Date,
    employeeWorkDisabilities: [] as EmployeeInterface[]
  }),
  computed: {
    weeklyStartDay() {
      const daysList = []

      if (!this.periodSelected && !this.datesSelected.length) {
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
        case 'custom': {
          if (this.datesSelected.length === 2) {
            const startDate = DateTime.fromJSDate(this.datesSelected[0]) // Fecha de inicio
            const endDate = DateTime.fromJSDate(this.datesSelected[1])   // Fecha de fin

            const daysBetween = Math.floor(endDate.diff(startDate, 'days').days) + 1

            for (let index = 0; index < daysBetween; index++) {
              const currentDay = startDate.plus({ days: index })
              const year = parseInt(currentDay.toFormat('yyyy'))
              const month = parseInt(currentDay.toFormat('LL'))
              const day = parseInt(currentDay.toFormat('dd'))

              daysList.push({
                year,
                month,
                day
              })
            }
          }
          break;
        }
        case 'fourteen': {
          const date = DateTime.fromJSDate(this.periodSelected) // Fecha seleccionada
          const startOfWeek = date.startOf('week') // Inicio de la semana seleccionada

          // Encontrar el jueves de la semana seleccionada
          let thursday = startOfWeek.plus({ days: 3 }) // Jueves es el cuarto día (índice 3)

          // Establecer el inicio del periodo como el jueves de dos semanas atrás
          let startDate = thursday.minus({ days: 24 }) // Jueves de dos semanas atrás

          // El periodo abarca 14 días desde el jueves de dos semanas atrás hasta el jueves de la semana seleccionada
          for (let index = 0; index < 14; index++) {
            const currentDay = startDate.plus({ days: index }) // Añadir cada día al periodo
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
    lineChartTitle() {
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

      if (this.visualizationMode?.value === 'fourteen') {
        // Convertimos la fecha inicio desde weeklyStartDay[0]
        const startDate = DateTime.fromObject({
          year: this.weeklyStartDay[0].year,
          month: this.weeklyStartDay[0].month,
          day: this.weeklyStartDay[0].day
        }).minus({ days: 1 }).setLocale('en');

        // Convertimos la fecha fin desde weeklyStartDay[1]
        const endDateObject = this.weeklyStartDay[this.weeklyStartDay.length - 1]
        const endDate = DateTime.fromObject({
          year: endDateObject.year,
          month: endDateObject.month,
          day: endDateObject.day
        }).minus({ days: 1 }).setLocale('en');

        return `Behavior from ${startDate.toFormat('DDD')} to ${endDate.toFormat('DDD')}`
      }

      if (this.visualizationMode?.value === 'custom') {
        const date = DateTime.fromJSDate(this.datesSelected[0]).setLocale('en')
        const dateEnd = DateTime.fromJSDate(this.datesSelected[1]).setLocale('en')
        return `Behavior from ${date.toFormat('DDD')} to ${dateEnd.toFormat('DDD')}`
      }
    },
    departmentCollection(): DepartmentInterface[] {
      const list: DepartmentInterface[] = JSON.parse(JSON.stringify(this.departmentList)) as DepartmentInterface[]
      const collection = list.map((item: DepartmentInterface) => ({ ...item, label: item.departmentAlias || item.departmentName }))
      return collection
    },
    departmentPositionCollection(): PositionInterface[] {
      const list: PositionInterface[] = JSON.parse(JSON.stringify(this.departmentPositionList)) as PositionInterface[]
      const collection = list.map((item: PositionInterface) => item)
      return collection
    },
    assistSyncStatusDate() {
      if (this.statusInfo) {
        const dateTime = DateTime.fromISO(`${this.statusInfo.assistStatusSyncs.updatedAt}`, { setZone: true }).setZone('UTC-6')
        const dateTimeFormat = dateTime.toFormat('ff')
        return dateTimeFormat
      }

      return ''
    },
    isRootUser() {
      const myGeneralStore = useMyGeneralStore()
      const flag = myGeneralStore.isRoot
      return flag
    },
    isRangeAtLeast3Days() {
      return this.isDatesAtLeast3Days()
    },
    canDisplayFrontExcel() {
      if (this.isRootUser) {
        return true
      }

      return false
    },
    displayNoAssignedShiftBtn() {
      if (this.visualizationMode && this.employeesWithOutShift.length > 0) {
        return true
      }

      return false
    },
  },
  created() {
    const minDateString = '2024-05-01T00:00:00'
    const minDate = new Date(minDateString)
    this.minDate = minDate
  },
  async mounted() {
    this.setAssistSyncStatus()
    this.getNoPaymentDates()

    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    const fullPath = this.$route.path
    const firstSegment = fullPath.split('/')[1]
    this.canSeeConsecutiveFaults = false
    const systemModuleSlug = firstSegment

    this.periodSelected = new Date()
    this.datesSelected = this.getDefaultDatesRange()

    await Promise.all([
      this.setDepartmetList(),
      this.setDefaultVisualizationMode()
    ])

    await this.init()

    this.canSeeConsecutiveFaults = await myGeneralStore.hasAccess(systemModuleSlug, 'consecutive-faults')
    myGeneralStore.setFullLoader(false)
  },
  methods: {
    async init() {
      await this.handlerSetInitialDepartmentList()
      await this.setDepartmentPositions()
      await this.setDepartmentPositionEmployeeList()
      await this.setGraphsData()
    },
    getNoPaymentDates() {
      const initialYear = DateTime.now().year - 10
      const filteredDays: Date[] = [];

      for (let index = 0; index < 20; index++) {
        const currentEvaluatedYear = initialYear + index
        let date = DateTime.local(currentEvaluatedYear, 1, 1);

        while (date.year === currentEvaluatedYear) {
          const isThursday = date.weekday === 4
          const isEvenWeek = date.weekNumber % 2 === 0

          if (!isThursday || (isThursday && !isEvenWeek)) {
            filteredDays.push(date.toJSDate())
          }

          date = date.plus({ days: 1 })
        }
      }

      this.disabledNoPaymentDates = filteredDays
    },
    setDefaultVisualizationMode() {
      const index = this.visualizationModeOptions.findIndex(opt => opt.value === 'custom')

      if (index >= 0) {
        this.visualizationMode = this.visualizationModeOptions[index]
      }

      this.handlerVisualizationModeChange()
    },
    getDefaultDatesRange() {
      const currentDay = DateTime.now().setZone('UTC-6').endOf('day').toJSDate()
      const previousDay = DateTime.now().setZone('UTC-6').startOf('day').toJSDate()

      return [previousDay, currentDay];
    },
    filtersEmployeesByStatus(employees: Array<EmployeeAssistStatisticInterface> | null) {
      if (!employees) {
        return []
      }
      return employees.filter(employee => this.isShowEmployeeByStatusSelected(employee))
    },
    handlerSetInitialDepartmentList() {
      this.departmentID = !this.departmentID ? `${this.$route.params.department}` : this.departmentID
      const department = this.departmentCollection.find((department: DepartmentInterface) => department.departmentId === parseInt(this.departmentID.toString()))
      this.departmenSelected = department ? department : null
    },
    isValidPeriodSelected() {
      if (this.visualizationMode?.value === 'fourteen' && !this.isValidFourteen()) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Invalid Date',
          detail: 'You should select a valid date. Only Thursdays are valid',
          life: 5000,
        })
        return false;
      } else {
        return (this.visualizationMode?.value === 'custom' && this.datesSelected[0] && this.datesSelected[1]) || this.visualizationMode?.value !== 'custom';
      }
    },
    isValidFourteen() {
      if (this.visualizationMode?.value === 'fourteen') {
        // valid if period selected is a thursday periodSelected
        const stringDate = DateTime.fromJSDate(this.periodSelected).toFormat('yyyy-LL-dd')
        const dateObject = {
          year: parseInt(stringDate.split('-')[0]),
          month: parseInt(stringDate.split('-')[1]),
          day: parseInt(stringDate.split('-')[2])
        }
        return this.isThursday(dateObject, false)
      }
      return true
    },
    isThursday(dateObject: any, addOneMonth = true) {
      const month = addOneMonth ? dateObject.month + 1 : dateObject.month
      const mydate = dateObject.year + '-' + (month < 10 ? '0' + month : month) + '-' + (dateObject.day < 10 ? '0' + dateObject.day : dateObject.day) + "T00:00:00";
      const weekDayName = moment(mydate).format('dddd');
      return weekDayName === 'Thursday';
    },
    async setGraphsData() {
      await this.setPeriodData()
      this.setGeneralData()
    },
    setPeriodCategories() {
      if (this.visualizationMode?.value === 'custom') {
        this.periodData.xAxis.categories = new AttendanceMonitorController().getCustomPeriodCategories(this.datesSelected)
      } else {
        this.periodData.xAxis.categories = new AttendanceMonitorController().getDepartmentPeriodCategories(this.visualizationMode?.value || 'weekly', this.periodSelected)
      }
    },
    async setGeneralData() {
      const assists = this.employeeDepartmentList.reduce((acc, val) => acc + val.assistStatistics.onTimePercentage, 0)
      const tolerances = this.employeeDepartmentList.reduce((acc, val) => acc + val.assistStatistics.onTolerancePercentage, 0)
      const delays = this.employeeDepartmentList.reduce((acc, val) => acc + val.assistStatistics.onDelayPercentage, 0)
      const faults = this.employeeDepartmentList.reduce((acc, val) => acc + val.assistStatistics.onFaultPercentage, 0)
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
    setPeriodData() {
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
        case 'custom':
          if (this.datesSelected.length === 2) {
            const startDate = DateTime.fromJSDate(this.datesSelected[0])  // Fecha de inicio del rango
            const endDate = DateTime.fromJSDate(this.datesSelected[1])    // Fecha de fin del rango

            // Calcular el número de días en el rango seleccionado
            periodLenght = Math.floor(endDate.diff(startDate, 'days').days) + 1

            // Establecer el inicio del periodo como la fecha de inicio seleccionada por el usuario
            start = startDate
          } else {
            // Si no hay un rango válido seleccionado, establecer el periodo en 0
            periodLenght = 0
          }
          break
        case 'fourteen': {
          const date = DateTime.local(yearPeriod, monthPerdiod, dayPeriod)
          const startOfWeek = date.startOf('week')
          // Encontrar el jueves de la semana seleccionada
          let thursday = startOfWeek.plus({ days: 3 }) // Jueves es el cuarto día (índice 3)
          // Establecer el inicio del periodo como el jueves de dos semanas atrás
          start = thursday.minus({ days: 24 }) // El jueves dos semanas atrás
          // El periodo es de 14 días (dos semanas completas)
          periodLenght = 14
          break
        }
        default:
          periodLenght = 0
          break
      }

      const dayStatisticsCollection: any = []

      if (start) {
        for (let index = 0; index < periodLenght; index++) {
          let currentDay = start.plus({ days: index })
          switch (this.visualizationMode?.value) {
            case 'fourteen':
              currentDay = currentDay.minus({ days: 1 })
          }
          const year = parseInt(currentDay.toFormat('yyyy'))
          const month = parseInt(currentDay.toFormat('LL'))
          const day = parseInt(currentDay.toFormat('dd'))
          const evalDate = `${year}-${`${month}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`
          let dayCalendar: any[] = []

          this.employeeDepartmentList.forEach(item => {
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
        })

        const serieData = []

        serieData.push({ name: 'On time', data: assistSerie, color: '#33D4AD' })
        serieData.push({ name: 'Tolerances', data: toleranceSerie, color: '#3CB4E5' })
        serieData.push({ name: 'Delays', data: delaySerie, color: '#FF993A' })
        serieData.push({ name: 'Faults', data: faultSerie, color: '#d45633' })
        this.periodData.series = serieData
        this.setPeriodCategories()
      }
    },
    async setDepartmetList() {
      const response = await new DepartmentService().getOnlyWithEmployees()
      this.departmentList = response.status === 200 ? response._data.data.departments : []
    },
    async setDepartmentPositions() {
      const response = await new DepartmentService().getDepartmentPositions(parseInt(this.departmentID) || 0)
      this.departmentPositionList = response.status === 200 ? response._data.data.positions : []
    },
    async handlerDeparmentSelect() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.departmentID = `${this.departmenSelected?.departmentId}`

      const path = this.$route.fullPath
      const pathId = path.split('/')[path.split('/').length - 1]
      const newPath = `${path}`.replace(`/${pathId}`, `/${this.departmentID}`)
      window.history.replaceState(null, '', newPath)

      await this.init()

      myGeneralStore.setFullLoader(false)
    },
    async handlerVisualizationModeChange() {
      const idx = this.visualizationModeOptions.findIndex(mode => mode.value === this.visualizationMode?.value)
      this.visualizationModeOptions.forEach(mode => mode.selected = false)

      if (idx >= 0) {
        this.visualizationModeOptions[idx].selected = true
      }

      if (this.visualizationMode?.value === 'fourteen') {
        this.periodSelected = this.getNextPayThursday()
      } else {
        this.periodSelected = new Date()
      }
    },
    async handlerPeriodChange() {
      if (this.isValidPeriodSelected()) {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        await Promise.all(this.employeeDepartmentList.map(emp => this.getEmployeeAssistCalendar(emp)))
        this.setGraphsData()
        await this.setEmployeesWithFaults()
        this.setSearchTime()
        myGeneralStore.setFullLoader(false)
      }
    },
    async onInputVisualizationModeChange() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.handlerVisualizationModeChange()
      await Promise.all(this.employeeDepartmentList.map(emp => this.getEmployeeAssistCalendar(emp)))
      this.setGraphsData()
      await this.setEmployeesWithFaults()
      this.setSearchTime()
      myGeneralStore.setFullLoader(false)
    },
    async handlerSearchEmployee(event: any) {
      if (event.query.trim().length) {
        const response = await new EmployeeService().getFilteredList(event.query.trim(), null, null, null, 1, 30, false, null)
        const list = response.status === 200 ? response._data.data.employees.data : []
        this.filteredEmployees = list
      }
    },
    async setDepartmentPositionEmployeeList() {
      if (!this.departmenSelected) {
        return false
      }

      const departmentId = parseInt(`${this.departmenSelected.departmentId}`)
      const positionId = null
      const response = await new EmployeeService().getFilteredList('', departmentId, positionId, null, 1, 99999999999, false, null)
      const employeeDepartmentPositionList = (response.status === 200 ? response._data.data.employees.data : []) as EmployeeInterface[]
      this.employeeDepartmentList = employeeDepartmentPositionList.map((employee) => ({ employee, assistStatistics: new AssistStatistic().toModelObject(), calendar: [] }))

      this.employeeDepartmentList = this.employeeDepartmentList.filter(emp => emp.employee.employeeAssistDiscriminator === 0)

      await Promise.all(this.employeeDepartmentList.map(emp => this.getEmployeeAssistCalendar(emp)))
      await this.setEmployeesWithFaults()
    },
    async getEmployeeAssistCalendar(employee: EmployeeAssistStatisticInterface) {
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      let startDay = ''
      let endDay = ''
      this.employeesWithOutShift = []
      if (this.visualizationMode?.value === 'fourteen') {
        const startDate = DateTime.fromObject({
          year: firstDay.year,
          month: firstDay.month,
          day: firstDay.day,
        })
        const endDate = DateTime.fromObject({
          year: lastDay.year,
          month: lastDay.month,
          day: lastDay.day,
        })

        const startDayMinusOne = startDate.minus({ days: 1 })
        const endDayMinusOne = endDate
        startDay = startDayMinusOne.toFormat('yyyy-MM-dd')
        endDay = endDayMinusOne.toFormat('yyyy-MM-dd')
      } else {
        startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
        endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      }
      const employeeID = employee?.employee?.employeeId || 0
      try {
        /*  const assistReq = await new AssistService().index(startDay, endDay, employeeID)
         const employeeCalendar = (assistReq.status === 200 ? assistReq._data.data.employeeCalendar : []) as AssistDayInterface[] */
        const newEmployeeCalendar = [] as AssistDayInterface[]
        const employeeAssistCalendarReq = await new EmployeeAssistCalendarService().index(startDay, endDay, employeeID)
        const calendars = (employeeAssistCalendarReq.status === 200 ? employeeAssistCalendarReq._data.data.employeeCalendar : [])

        const shiftExceptionService = new ShiftExceptionService()
        for await (const calendar of calendars) {
          calendar.exceptions = []
          if (calendar.hasExceptions) {
            const shiftExceptionResponse = await shiftExceptionService.getByEmployee(employeeID, null, calendar.day, calendar.day)
            calendar.exceptions = shiftExceptionResponse
          }

          const employeeCalendar = {
            day: calendar.day,
            assist: calendar,
          } as AssistDayInterface

          newEmployeeCalendar.push(employeeCalendar)
        }
        employee.calendar = newEmployeeCalendar
        this.setGeneralStatisticsData(employee, employee.calendar)
        if (employeeAssistCalendarReq.status === 400) {
          const employeeNoShift = employee?.employee || null

          if (employeeNoShift) {
            const employeeNoShiftName = `${employeeNoShift.employeeFirstName} ${employeeNoShift.employeeLastName}`
            const departmentPosition = `${employeeNoShift.department?.departmentName || ''}, ${employeeNoShift.position?.positionName || ''}`
            console.log(`No Shift: (${employeeID.toString().padStart(5, '0')}) ${employeeNoShiftName} -> ${departmentPosition}`)
            this.employeesWithOutShift.push(employeeNoShift)
          }
        }
      } catch (error) {
      }
    },
    getDepartmentPositionAssistStatistics() {
      const positionListStatistics: any[] = []

      this.departmentPositionCollection.forEach((position: any) => {
        const positionId = position?.position?.positionId
        const list = this.employeeDepartmentList.filter(item => item.employee.positionId === positionId)
        const statistics = {
          onTimePercentage: Math.round(list.reduce((acc, val) => acc + val.assistStatistics.onTimePercentage, 0) / list.length),
          onTolerancePercentage: Math.round(list.reduce((acc, val) => acc + val.assistStatistics.onTolerancePercentage, 0) / list.length),
          onDelayPercentage: Math.round(list.reduce((acc, val) => acc + val.assistStatistics.onDelayPercentage, 0) / list.length),
          onEarlyOutPercentage: Math.round(list.reduce((acc, val) => acc + val.assistStatistics.onEarlyOutPercentage, 0) / list.length),
          onFaultPercentage: Math.round(list.reduce((acc, val) => acc + val.assistStatistics.onFaultPercentage, 0) / list.length),
        }
        if (this.isShowByStatusSelected(statistics)) {
          positionListStatistics.push({
            department: this.departmenSelected,
            position: position.position,
            employees: list,
            statistics
          })
        }
      })

      return positionListStatistics
    },
    isShowByStatusSelected(statistics: any) {
      if (this.statusSelected === 'Faults') {
        return statistics?.onFaultPercentage ?? 0 > 0
      } else if (this.statusSelected === 'Delays') {
        return statistics?.onDelayPercentage ?? 0 > 0
      } else if (this.statusSelected === 'Early outs') {
        return statistics?.onEarlyOutPercentage ?? 0 > 0
      } else if (this.statusSelected === 'Tolerances') {
        return statistics?.onTolerancePercentage ?? 0 > 0
      } else if (this.statusSelected === 'On time') {
        return statistics?.onTimePercentage ?? 0 > 0
      } else if (this.statusSelected === null || this.statusSelected === 'All') {
        return true
      }
      return true
    },
    isShowEmployeeByStatusSelected(employee: EmployeeAssistStatisticInterface) {
      if (this.statusSelected === 'Faults') {
        return employee?.assistStatistics?.onFaultPercentage ?? 0 > 0
      } else if (this.statusSelected === 'Delays') {
        return employee?.assistStatistics?.onDelayPercentage ?? 0 > 0
      } else if (this.statusSelected === 'Early outs') {
        return employee?.assistStatistics?.onEarlyOutPercentage ?? 0 > 0
      } else if (this.statusSelected === 'Tolerances') {
        return employee?.assistStatistics?.onTolerancePercentage ?? 0 > 0
      } else if (this.statusSelected === 'On time') {
        return employee?.assistStatistics?.onTimePercentage ?? 0 > 0
      } else if (this.statusSelected === null || this.statusSelected === 'All') {
        return true
      }
      return true
    },
    setGeneralStatisticsData(employee: EmployeeAssistStatisticInterface, employeeCalendar: AssistDayInterface[]) {
      const assists = employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'ontime').length
      const tolerances = employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'tolerance').length
      const delays = employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'delay').length
      const earlyOuts = employeeCalendar.filter((assistDate) => assistDate.assist.checkOutStatus === 'delay').length
      const faults = employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'fault' && !assistDate.assist.isFutureDay && !assistDate.assist.isRestDay).length
      const totalAvailable = assists + tolerances + delays + faults

      const assist = Math.round((assists / totalAvailable) * 100)
      const tolerance = Math.round((tolerances / totalAvailable) * 100)
      const delay = Math.round((delays / totalAvailable) * 100)
      const earlyOut = Math.round((earlyOuts / totalAvailable) * 100)
      const fault = Math.round((faults / totalAvailable) * 100)
      const assistStatistics: AssistStatisticInterface = {
        onTimePercentage: Number.isNaN(assist) ? 0 : assist,
        onTolerancePercentage: Number.isNaN(tolerance) ? 0 : tolerance,
        onDelayPercentage: Number.isNaN(delay) ? 0 : delay,
        onEarlyOutPercentage: Number.isNaN(earlyOut) ? 0 : earlyOut,
        onFaultPercentage: Number.isNaN(fault) ? 0 : fault,
        assists: 0,
        tolerances: 0,
        delays: 0,
        earlyOuts: 0,
        faults: 0,
        totalAvailable: 0
      }

      employee.assistStatistics = assistStatistics
    },
    onEmployeeSelect() {
      if (this.selectedEmployee && this.selectedEmployee.employeeCode) {
        this.$router.push(`/employees-attendance-monitor/${this.selectedEmployee.employeeCode}`)
      }
    },
    async setAssistSyncStatus() {
      try {
        const res = await new AssistService().syncStatus()
        const statusInfo: AssistSyncStatus = res.status === 200 ? res._data : null
        this.statusInfo = statusInfo
      } catch (error) { }
      this.onSyncStatus = false
    },
    async getExcel(reportType: string) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const departmentId = this.departmenSelected?.departmentId || 0
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      let startDay = ''
      let endDay = ''
      this.datePay = ''
      if (this.visualizationMode?.value === 'fourteen') {
        const startDate = DateTime.fromObject({
          year: firstDay.year,
          month: firstDay.month,
          day: firstDay.day,
        })
        const endDate = DateTime.fromObject({
          year: lastDay.year,
          month: lastDay.month,
          day: lastDay.day,
        })

        const startDayMinusOne = startDate.minus({ days: 1 })
        const endDayMinusOne = endDate.minus({ days: 1 })
        startDay = startDayMinusOne.toFormat('yyyy-MM-dd')
        endDay = endDayMinusOne.toFormat('yyyy-MM-dd')
        this.datePay = this.getNextPayThursdayFromPeriodSelected(new Date(this.periodSelected))
      } else {
        startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
        endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      }
      const assistService = new AssistService()
      const assistResponse = await assistService.getExcelByDepartment(startDay, endDay, this.datePay, departmentId, reportType)
      if (assistResponse.status === 201) {
        const blob = await assistResponse._data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Department ${reportType}.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.$toast.add({
          severity: 'success',
          summary: 'Excel assist',
          detail: 'Excel was created successfully',
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
      } else {
        const msgError = assistResponse._data.error ? assistResponse._data.error : assistResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: 'Excel assist',
          detail: msgError,
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
      }
    },
    getNextPayThursday() {
      const today = DateTime.now(); // Fecha actual
      let nextPayDate = today.set({ weekday: 4 })
      if (nextPayDate < today) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      while (nextPayDate.weekNumber % 2 !== 0) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      return nextPayDate.toJSDate()
    },
    async getRotation() {
      if (this.departmenSelected) {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        const depId = this.departmenSelected.departmentId as number
        const start = '2000-01-01'
        const end = DateTime.now().toFormat('yyyy-MM-dd')
        const res = await new DepartmentService().getRotationIndex(depId, start, end)
        this.rotationIndex = res.status === 200 ? res._data.data.rotationIndex : 0
        myGeneralStore.setFullLoader(false)
      }
    },
    getNextPayThursdayFromPeriodSelected(date: Date) {
      const today = DateTime.fromJSDate(date); // Fecha seleccionada por el usuario
      let nextPayDate = today.set({ weekday: 4 })
      if (nextPayDate < today) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      while (nextPayDate.weekNumber % 2 !== 0) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      const dayOfMonth = nextPayDate.day; // Día de la fecha calculada
      let isFirstCatorcena = false;
      if (dayOfMonth >= 1 && dayOfMonth <= 15) {
        isFirstCatorcena = true;
      }
      const datePay = DateTime.fromJSDate(nextPayDate.toJSDate()).toFormat('yyyy-MM-dd')
      return datePay
    },
    getVacations() {
      if (!this.periodSelected && !this.datesSelected.length) {
        return []
      }
      this.vacationDateStart = ''
      this.vacationDateEnd = ''
      switch (this.visualizationMode?.value) {
        case 'monthly': {
          const monthPerdiod = parseInt(DateTime.fromJSDate(this.periodSelected).toFormat('LL'))
          const yearPeriod = parseInt(DateTime.fromJSDate(this.periodSelected).toFormat('yyyy'))
          let start
          const date = DateTime.local(yearPeriod, monthPerdiod, 1)
          let days = date.daysInMonth ? date.daysInMonth : 0
          days = days - 1
          start = date.startOf('month')

          this.vacationDateStart = start.toFormat('yyyy-MM-dd')
          this.vacationDateEnd = start.plus({ days: days }).toFormat('yyyy-MM-dd')
          break;
        }
        case 'weekly': {
          const date = DateTime.fromJSDate(this.periodSelected)
          this.vacationDateStart = date.toFormat('yyyy-MM-dd')
          this.vacationDateEnd = date.plus({ days: 6 }).toFormat('yyyy-MM-dd')
          break;
        }
        case 'custom': {
          if (this.datesSelected.length === 2) {
            const startDate = DateTime.fromJSDate(this.datesSelected[0])
            const endDate = DateTime.fromJSDate(this.datesSelected[1])
            this.vacationDateStart = startDate.toFormat('yyyy-MM-dd')
            this.vacationDateEnd = endDate.toFormat('yyyy-MM-dd')
          }
          break;
        }
        case 'fourteen': {
          const date = DateTime.fromJSDate(this.periodSelected)
          const startOfWeek = date.startOf('week')
          let thursday = startOfWeek.plus({ days: 3 })
          let startDate = thursday.minus({ days: 25 })
          this.vacationDateStart = startDate.toFormat('yyyy-MM-dd')
          this.vacationDateEnd = startDate.plus({ days: 14 }).toFormat('yyyy-MM-dd')
          break;
        }
      }

      this.currentDepartmentId = parseInt(!this.departmentID ? this.$route.params.department.toString() : this.departmentID)
      this.drawerVacations = true
    },
    isDatesAtLeast3Days() {
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      let startDay = ''
      let endDay = ''
      if (this.visualizationMode?.value === 'fourteen') {
        const startDate = DateTime.fromObject({
          year: firstDay.year,
          month: firstDay.month,
          day: firstDay.day,
        })
        const endDate = DateTime.fromObject({
          year: lastDay.year,
          month: lastDay.month,
          day: lastDay.day,
        })

        const startDayMinusOne = startDate.minus({ days: 1 })
        const endDayMinusOne = endDate
        startDay = startDayMinusOne.toFormat('yyyy-MM-dd')
        endDay = endDayMinusOne.toFormat('yyyy-MM-dd')
      } else if (this.visualizationMode?.value === 'custom') {
        startDay = DateTime.fromJSDate(this.datesSelected[0]).toFormat('yyyy-MM-dd')
        endDay = DateTime.fromJSDate(this.datesSelected[1]).toFormat('yyyy-MM-dd')

      } else {
        const endDate = DateTime.fromObject({
          year: lastDay.year,
          month: lastDay.month,
          day: lastDay.day,
        })
        startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
        endDay = `${endDate.year}-${`${endDate.month}`.padStart(2, '0')}-${`${endDate.day}`.padStart(2, '0')}`
      }
      const start = new Date(startDay.replace(/-/g, '/'))
      start.setHours(0, 0, 0, 0)
      const end = new Date(endDay.replace(/-/g, '/'))
      const diffInMs = end.getTime() - start.getTime()
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
      return (diffInDays + 1) >= 3 ? true : false
    },
    async setEmployeesWithFaults() {
      if (!this.departmenSelected) {
        return false
      }

      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      this.employeesWithFaults = []

      const assistEmployees = this.employeeDepartmentList.filter(a => !a.employee.employeeIgnoreConsecutiveAbsences)
      for await (const assist of assistEmployees) {
        if (assist.employee.employeeAssistDiscriminator !== 0) continue

        let consecutiveFaults = 0
        let found3Consecutive = false

        for (const calendar of assist.calendar) {
          if (calendar.assist.checkInStatus === 'fault' && !calendar.assist.isRestDay && !calendar.assist.isFutureDay && !calendar.assist.isWorkDisabilityDate && !calendar.assist.isVacationDate && !calendar.assist.isHoliday) {
            consecutiveFaults++
            if (consecutiveFaults === 3) {
              found3Consecutive = true
              break
            }
          } else {
            consecutiveFaults = 0
          }
        }

        if (found3Consecutive) {
          assist.employee.faultDays = []

          for (const calendar of assist.calendar) {
            if (calendar.assist.checkInStatus === 'fault' && !calendar.assist.isRestDay && !calendar.assist.isFutureDay && !calendar.assist.isWorkDisabilityDate && !calendar.assist.isVacationDate && !calendar.assist.isHoliday) {
              assist.employee.faultDays.push({
                day: DateTime.fromISO(calendar.day).setLocale('en').toFormat('DDD')
              })
            }
          }

          this.employeesWithFaults.push(assist.employee)
        }
      }

      const departmentId = parseInt(`${this.departmenSelected.departmentId}`)
      const positionId = null
      const response = await new EmployeeService().getFilteredList('', departmentId, positionId, null, 1, 999999999, false, null)
      const employeeDepartmentPositionList = (response.status === 200 ? response._data.data.employees.data : []) as EmployeeInterface[]
      this.employeeDiscrimitorsList = employeeDepartmentPositionList.map((employee) => ({ employee, assistStatistics: new AssistStatistic().toModelObject(), calendar: [] }))

      this.employeeDiscrimitorsList = this.employeeDiscrimitorsList.filter(emp => emp.employee.employeeAssistDiscriminator === 1)

      await Promise.all(this.employeeDiscrimitorsList.map(emp => this.getEmployeeAssistCalendar(emp)))

      const assistEmployeeDiscrimitors = this.employeeDiscrimitorsList.filter(a => !a.employee.employeeIgnoreConsecutiveAbsences)
      for await (const assist of assistEmployeeDiscrimitors) {
        assist.employee.faultDays = []

        if (assist.calendar.length > 0) {
          let noCheckStreak = 0
          const sortedCalendar = assist.calendar

          for (const calendar of sortedCalendar) {
            const noChecks = !calendar.assist.checkIn &&
              !calendar.assist.checkOut &&
              !calendar.assist.checkEatIn &&
              !calendar.assist.checkEatOut && !calendar.assist.isRestDay && !calendar.assist.isFutureDay && !calendar.assist.isWorkDisabilityDate && !calendar.assist.isVacationDate
              && !calendar.assist.isHoliday

            if (noChecks) {
              assist.employee.faultDays.push({
                day: DateTime.fromISO(calendar.day).setLocale('en').toFormat('DDD')
              })
              noCheckStreak++
              if (noCheckStreak === 3) {
                const alreadyAdded = this.employeesWithFaults.some(e => e.employeeId === assist.employee.employeeId)
                if (!alreadyAdded) {
                  this.employeesWithFaults.push(assist.employee)
                }
              }
            } else {
              noCheckStreak = 0
            }
          }
        }
      }
      myGeneralStore.setFullLoader(false)
    },
    async getExcelAllAssistance() {
      await this.verifiySearchTime()
      const assistExcelService = new AssistExcelService()
      const assists = this.getDepartmentPositionAssistStatistics()
      const range = this.getRange()
      const title = `${range.title}`
      const dateEnd = `${range.dateEnd}`
      await assistExcelService.getExcelAllAssistance(assists, title ? title : '', dateEnd)
    },
    async getExcelIncidentSummary() {
      await this.verifiySearchTime()
      const assistExcelService = new AssistExcelService()
      const assists = this.getDepartmentPositionAssistStatistics()
      const range = this.getRange()
      const title = `Summary Report  ${range.title}`
      await assistExcelService.getExcelIncidentSummary(assists, title ? title : '', range.dateEnd)
    },
    async getExcelIncidentSummaryPayRoll() {
      await this.verifiySearchTime()
      const assistExcelService = new AssistExcelService()
      const assists = this.getDepartmentPositionAssistStatistics()
      const tradeName = await assistExcelService.getTradeName()
      const range = this.getRange()
      const title = `Incidencias ${tradeName} ${range.title}`
      const filters = {
        assists: assists,
        title: title ? title : '',
        datePay: this.datePay,
        employeeWorkDisabilities: this.employeeWorkDisabilities,
      } as AssistExcelFilterIncidentSummaryPayRollInterface
      await assistExcelService.getExcelIncidentSummaryPayRoll(filters)
    },
    getRange() {
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      let startDay = ''
      let endDay = ''
      this.datePay = ''
      if (this.visualizationMode?.value === 'fourteen') {
        const startDate = DateTime.fromObject({
          year: firstDay.year,
          month: firstDay.month,
          day: firstDay.day,
        })
        const endDate = DateTime.fromObject({
          year: lastDay.year,
          month: lastDay.month,
          day: lastDay.day,
        })

        const startDayMinusOne = startDate.minus({ days: 1 })
        const endDayMinusOne = endDate.minus({ days: 1 })
        startDay = startDayMinusOne.toFormat('yyyy-MM-dd')
        endDay = endDayMinusOne.toFormat('yyyy-MM-dd')
        this.datePay = this.getNextPayThursdayFromPeriodSelected(new Date(this.periodSelected))
      } else {
        startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
        endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      }

      const assistExcelService = new AssistExcelService()
      const dayStart = assistExcelService.dateDay(startDay)
      const monthStart = assistExcelService.dateMonth(startDay)
      const yearStart = assistExcelService.dateYear(startDay)
      const calendarDayStart = assistExcelService.calendarDay(yearStart, monthStart, dayStart)
      const dayEnd = assistExcelService.dateDay(endDay)
      const monthEnd = assistExcelService.dateMonth(endDay)
      const yearEnd = assistExcelService.dateYear(endDay)
      const calendarDayEnd = assistExcelService.calendarDay(yearEnd, monthEnd, dayEnd)

      return { title: `From ${calendarDayStart} to ${calendarDayEnd}`, dateEnd: endDay }
    },
    setSearchTime() {
      if (this.visualizationMode?.value === 'fourteen') {
        this.getWorkDisabilities()
      }
      const now = new Date()
      this.searchTime = now
    },
    async verifiySearchTime() {
      const now = new Date()
      const nowTime = now.getTime()
      if (this.searchTime instanceof Date) {
        const diffMs = nowTime - this.searchTime.getTime()
        const diffMinutes = diffMs / 1000 / 60
        if (diffMinutes >= 5) {
          await this.handlerPeriodChange()
        }
      }
    },
    async getWorkDisabilities() {
      this.employeeWorkDisabilities = []
      const employeeService = new EmployeeService()
      this.getRange()
      this.currentDepartmentId = parseInt(!this.departmentID ? this.$route.params.department.toString() : this.departmentID)
      if (this.currentDepartmentId) {
        const employeeResponse = await employeeService.getDaysWorkDisabilityAll(this.datePay, this.currentDepartmentId, null)
        if (employeeResponse.status === 200) {
          this.employeeWorkDisabilities = employeeResponse._data.data.data
        }
      }
    },
  }
})
