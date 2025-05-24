import { defineComponent } from 'vue'
import { DateTime } from 'luxon'
import { useMyGeneralStore } from '~/store/general'
import moment from 'moment';

import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

import type { VisualizationModeOptionInterface } from '~/resources/scripts/interfaces/VisualizationModeOptionInterface'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { EmployeeAssistStatisticInterface } from '~/resources/scripts/interfaces/EmployeeAssistStatisticInterface'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import type { AssistSyncStatus } from '~/resources/scripts/interfaces/AssistSyncStatus'

import AttendanceMonitorController from '~/resources/scripts/controllers/AttendanceMonitorController'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import AssistStatistic from '~/resources/scripts/models/AssistStatistic'
import AssistService from '~/resources/scripts/services/AssistService'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import axios from 'axios';
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface';
import type { AssistExcelRowInterface } from '~/resources/scripts/interfaces/assist_excel_row_interface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'EmployeesMonitorPosition',
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
    statusList: [{ name: 'All' }, { name: 'Faults' }, { name: 'Delays' }, { name: 'Tolerances' }, { name: 'On time' }, { name: 'Early outs' }] as Array<Object>,
    statusSelected: null as string | null,
    visualizationModeOptions: [
      { name: 'Custom', value: 'custom', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: true, number_months: 1 },
      { name: 'Monthly', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false, number_months: 1 },
      { name: 'Weekly', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false, number_months: 1 },
      { name: 'Fourteen', value: 'fourteen', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false, number_months: 1 },
    ] as VisualizationModeOptionInterface[],
    visualizationMode: null as VisualizationModeOptionInterface | null,
    periodSelected: new Date() as Date,
    datesSelected: [] as Date[],
    maxDate: new Date() as Date,
    minDate: new Date() as Date,
    employeeDepartmentPositionList: [] as EmployeeAssistStatisticInterface[],
    department: null as DepartmentInterface | null,
    position: null as PositionInterface | null,
    employeeList: [] as EmployeeInterface[],
    selectedEmployee: null as EmployeeInterface | null,
    filteredEmployees: [] as EmployeeInterface[],
    statusInfo: null as AssistSyncStatus | null,
    departmentList: [] as DepartmentInterface[],
    evaluatedEmployees: 0 as number,
    evaluatedAssistEmployees: 0 as number,
    estimatedArrivals: 0 as number,
    datePay: '' as string,
    onSyncStatus: true,
    disabledNoPaymentDates: [] as Date[],
    drawerVacations: false,
    vacationDateStart: '',
    vacationDateEnd: '',
    employeesWithOutShift: [] as EmployeeInterface[],
    drawerEmployeeWithOutShift: false,
    canSeeConsecutiveFaults: false,
    drawerEmployeeWithFaults: false,
    employeesWithFaults: [] as EmployeeInterface[],
    employeeDiscrimitorsList: [] as EmployeeAssistStatisticInterface[],
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
    assistSyncStatusDate() {
      if (this.statusInfo) {
        const dateTime = DateTime.fromISO(`${this.statusInfo.assistStatusSyncs.updatedAt}`, { setZone: true }).setZone('UTC-6')
        const dateTimeFormat = dateTime.toFormat('ff')
        return dateTimeFormat
      }

      return ''
    },
    isRangeAtLeast3Days() {
      return this.isDatesAtLeast3Days()
    },
    isRoot() {
      const myGeneralStore = useMyGeneralStore()
      return myGeneralStore.isRoot
    },
    displayConsecutiveFaultsBtn() {
      if (this.visualizationMode && this.isRangeAtLeast3Days && this.canSeeConsecutiveFaults) {
        return true
      }

      return false
    },
    displayNoAssignedShiftBtn() {
      if (this.visualizationMode) {
        return true
      }

      return false
    }
  },
  created() {
    const minDateString = '2024-05-01T00:00:00'
    const minDate = new Date(minDateString)
    this.minDate = minDate
    this.periodSelected = new Date()
    this.datesSelected = this.getDefaultDatesRange()
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
    this.canSeeConsecutiveFaults = await myGeneralStore.hasAccess(systemModuleSlug, 'consecutive-faults')

    await this.setDefaultVisualizationMode()

    await Promise.all([
      this.setDepartmetList(),
      this.setDepartmentPositionEmployeeList()
    ])

    this.setGeneralData()
    this.setPeriodData()
    this.getDepartmentPositionAssistStatistics()

    myGeneralStore.setFullLoader(false)
  },
  methods: {
    isThursday(dateObject: any, addOneMonth = true) {
      const month = addOneMonth ? dateObject.month + 1 : dateObject.month
      const mydate = dateObject.year + '-' + (month < 10 ? '0' + month : month) + '-' + (dateObject.day < 10 ? '0' + dateObject.day : dateObject.day) + "T00:00:00";
      const weekDayName = moment(mydate).format('dddd');
      return weekDayName === 'Thursday';
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
    async setDefaultVisualizationMode() {
      const index = this.visualizationModeOptions.findIndex(opt => opt.value === 'custom')

      if (index >= 0) {
        this.visualizationMode = this.visualizationModeOptions[index]
      }

      await this.handlerVisualizationModeChange()
    },
    getDefaultDatesRange() {
      const currentDay = DateTime.now().setZone('UTC-6').endOf('day').toJSDate()
      const previousDay = DateTime.now().setZone('UTC-6').startOf('day').toJSDate()

      return [previousDay, currentDay];
    },
    async setGeneralData() {
      const assists = this.employeeDepartmentPositionList.reduce((acc, val) => acc + (val.assistStatistics.onTimePercentage || 0), 0)
      const tolerances = this.employeeDepartmentPositionList.reduce((acc, val) => acc + (val.assistStatistics.onTolerancePercentage || 0), 0)
      const delays = this.employeeDepartmentPositionList.reduce((acc, val) => acc + (val.assistStatistics.onDelayPercentage || 0), 0)
      const faults = this.employeeDepartmentPositionList.reduce((acc, val) => acc + (val.assistStatistics.onFaultPercentage || 0), 0)
      const totalAvailable = assists + tolerances + delays + faults
      const serieData = []

      const qtyOnTime = this.employeeDepartmentPositionList.reduce((acc, val) => acc + (val.assistStatistics.assists || 0), 0)
      const qtyOnTolerance = this.employeeDepartmentPositionList.reduce((acc, val) => acc + (val.assistStatistics.tolerances || 0), 0)
      const qtyOnDelay = this.employeeDepartmentPositionList.reduce((acc, val) => acc + (val.assistStatistics.delays || 0), 0)
      const qtyOnFault = this.employeeDepartmentPositionList.reduce((acc, val) => acc + (val.assistStatistics.faults || 0), 0)


      const assist = Math.round((assists / totalAvailable) * 100)
      const tolerance = Math.round((tolerances / totalAvailable) * 100)
      const delay = Math.round((delays / totalAvailable) * 100)
      const fault = Math.round((faults / totalAvailable) * 100)

      serieData.push({ name: `On time (${`${qtyOnTime}`.padStart(2, '0')} Arrivals)`, y: assist, color: '#33D4AD' })
      serieData.push({ name: `Tolerances (${`${qtyOnTolerance}`.padStart(2, '0')} Arrivals)`, y: tolerance, color: '#3CB4E5' })
      serieData.push({ name: `Delays (${`${qtyOnDelay}`.padStart(2, '0')} Arrivals)`, y: delay, color: '#FF993A' })
      serieData.push({ name: `Faults (${`${qtyOnFault}`.padStart(2, '0')} Absences)`, y: fault, color: '#d45633' })

      this.generalData.series[0].data = serieData
      this.evaluatedEmployees = this.employeeDepartmentPositionList.filter(e => e.assistStatistics.totalAvailable > 0).length
      this.estimatedArrivals = qtyOnTime + qtyOnTolerance + qtyOnDelay + qtyOnFault
      this.evaluatedAssistEmployees = this.estimatedArrivals - qtyOnFault
    },
    hasEmployees(employeeList: Array<EmployeeAssistStatisticInterface> | null) {
      if (!employeeList) {
        return false
      } else {
        return this.filtersEmployeesByStatus(employeeList).length > 0
      }
    },
    isShowByStatusSelected(employee: EmployeeAssistStatisticInterface) {
      if (this.statusSelected === 'Faults') {
        return employee?.assistStatistics.onFaultPercentage ?? 0 > 0
      } else if (this.statusSelected === 'Delays') {
        return employee?.assistStatistics.onDelayPercentage ?? 0 > 0
      } else if (this.statusSelected === 'Early outs') {
        return employee?.assistStatistics.onEarlyOutPercentage ?? 0 > 0
      } else if (this.statusSelected === 'Tolerances') {
        return employee?.assistStatistics.onTolerancePercentage ?? 0 > 0
      } else if (this.statusSelected === 'On time') {
        return employee?.assistStatistics.onTimePercentage ?? 0 > 0
      } else if (this.statusSelected === null || this.statusSelected === 'All') {
        return true
      }
      return true
    },
    filtersEmployeesByStatus(employees: Array<EmployeeAssistStatisticInterface> | null) {
      if (!employees) {
        return []
      }
      return employees.filter(employee => this.isShowByStatusSelected(employee) && !!(employee) && !!(employee?.employee) && employee?.assistStatistics?.totalAvailable > 0)
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
        const earlyOutSerie: number[] = []
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
    setPeriodCategories() {
      if (this.visualizationMode?.value === 'custom') {
        this.periodData.xAxis.categories = new AttendanceMonitorController().getCustomPeriodCategories(this.datesSelected)
      } else {
        this.periodData.xAxis.categories = new AttendanceMonitorController().getDepartmentPeriodCategories(this.visualizationMode?.value || 'weekly', this.periodSelected)
      }
    },
    async setDepartmentPositionEmployeeList() {
      const departmentId = null
      const positionId = null
      const empsLimit = this.$config.public.ENVIRONMENT === 'production' ? 99999999999 : 99999999999
      const response = await new EmployeeService().getFilteredList('', departmentId, positionId, null, 1, empsLimit, false, null)
      const employeeDepartmentPositionList = (response.status === 200 ? response._data.data.employees.data : []) as EmployeeInterface[]
      this.employeeDepartmentPositionList = employeeDepartmentPositionList.map((employee) => ({ employee, assistStatistics: new AssistStatistic().toModelObject(), calendar: [] }))

      this.employeeDepartmentPositionList = this.employeeDepartmentPositionList.filter(emp => emp.employee.employeeAssistDiscriminator === 0)

      await Promise.all(this.employeeDepartmentPositionList.map(emp => this.getEmployeeAssistCalendar(emp)))
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
        const endDayMinusOne = endDate//.minus({ days: 1 })
        startDay = startDayMinusOne.toFormat('yyyy-MM-dd')
        endDay = endDayMinusOne.toFormat('yyyy-MM-dd')
      } else {
        startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
        endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      }
      const employeeID = employee?.employee?.employeeId || 0
      try {
        const assistReq = await new AssistService().index(startDay, endDay, employeeID)
        const employeeCalendar = (assistReq.status === 200 ? assistReq._data.data.employeeCalendar : []) as AssistDayInterface[]
        employee.calendar = employeeCalendar
        this.setGeneralStatisticsData(employee, employee.calendar)

        if (assistReq.status === 400) {
          const employeeNoShift = employee?.employee || null

          if (employeeNoShift) {
            this.employeesWithOutShift.push(employeeNoShift)
          }
        }

      } catch (error) {
      }
    },
    async setDepartmetList() {
      const response = await new DepartmentService().getAllDepartmentList()
      this.departmentList = response.status === 200 ? response._data.data.departments : []
    },
    getDepartmentPositionAssistStatistics() {
      const departmentListStatistics: any[] = []

      this.departmentList.forEach((department: DepartmentInterface) => {
        const departmentId = department.departmentId
        const list = this.employeeDepartmentPositionList.filter(item => item.employee.departmentId === departmentId)
        const statistics = {
          onTimePercentage: Math.round(list.reduce((acc, val) => acc + (val.assistStatistics.onTimePercentage || 0), 0) / list.length) || 0,
          onTolerancePercentage: Math.round(list.reduce((acc, val) => acc + (val.assistStatistics.onTolerancePercentage || 0), 0) / list.length) || 0,
          onDelayPercentage: Math.round(list.reduce((acc, val) => acc + (val.assistStatistics.onDelayPercentage || 0), 0) / list.length) || 0,
          onEarlyOutPercentage: Math.round(list.reduce((acc, val) => acc + (val.assistStatistics.onEarlyOutPercentage || 0), 0) / list.length) || 0,
          onFaultPercentage: Math.round(list.reduce((acc, val) => acc + (val.assistStatistics.onFaultPercentage || 0), 0) / list.length) || 0,
        }
        departmentListStatistics.push({
          department: department,
          statistics,
          employees: list
        })
      })
      return departmentListStatistics
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

      const assistStatistics = {
        onTimePercentage: assist,
        onTolerancePercentage: tolerance,
        onDelayPercentage: delay,
        onEarlyOutPercentage: earlyOut,
        onFaultPercentage: fault,
        assists,
        tolerances,
        delays,
        earlyOuts,
        faults,
        totalAvailable,
      }

      employee.assistStatistics = assistStatistics

    },
    async handlerVisualizationModeChange() {
      const idx = this.visualizationModeOptions.findIndex(mode => mode.value === this.visualizationMode?.value)
      this.visualizationModeOptions.forEach(mode => mode.selected = false)

      if (idx >= 0) {
        this.visualizationModeOptions[idx].selected = true
      }

      this.periodSelected = new Date()
      this.datesSelected = this.getDefaultDatesRange();
    },
    async onInputVisualizationModeChange() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.handlerVisualizationModeChange()

      if (this.visualizationMode?.value === 'fourteen') {
        this.periodSelected = this.getNextPayThursday()
      }

      await Promise.all(this.employeeDepartmentPositionList.map(emp => this.getEmployeeAssistCalendar(emp)))

      this.setGeneralData()
      this.setPeriodData()

      myGeneralStore.setFullLoader(false)
    },
    async handlerPeriodChange() {
      if (this.isValidPeriodSelected()) {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        await Promise.all(this.employeeDepartmentPositionList.map(emp => this.getEmployeeAssistCalendar(emp)))
        this.setGeneralData()
        this.setPeriodData()
        myGeneralStore.setFullLoader(false)
      }
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
    async handlerSearchEmployee(event: any) {
      if (event.query.trim().length) {
        const response = await new EmployeeService().getFilteredList(event.query.trim(), null, null, null, 1, 30, false, null)
        const list = response.status === 200 ? response._data.data.employees.data : []
        this.filteredEmployees = list
      }
    },
    onEmployeeSelect() {
      if (this.selectedEmployee && this.selectedEmployee.employeeCode) {
        this.$router.push(`/employees-attendance-monitor/${this.selectedEmployee.employeeCode}`)
      }
    },
    async getExcel(reportType: string) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
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
      const assistResponse = await assistService.getExcelAll(startDay, endDay, this.datePay, reportType)
      if (assistResponse.status === 201) {
        const blob = await assistResponse._data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `All Department ${reportType}.xlsx`)
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
    async setAssistSyncStatus() {
      try {
        const res = await new AssistService().syncStatus()
        const statusInfo: AssistSyncStatus = res.status === 200 ? res._data : null
        this.statusInfo = statusInfo
      } catch (error) { }
      this.onSyncStatus = false
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
    async showEmployeesWithFaults() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      this.employeesWithFaults = []
      for await (const assist of this.employeeDepartmentPositionList) {
        if (assist.employee.employeeAssistDiscriminator !== 0) continue

        let consecutiveFaults = 0
        let found3Consecutive = false

        for (const calendar of assist.calendar) {
          if (calendar.assist.checkInStatus === 'fault' && !calendar.assist.isRestDay && !calendar.assist.isFutureDay && !calendar.assist.isWorkDisabilityDate && !calendar.assist.isVacationDate) {
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
            if (calendar.assist.checkInStatus === 'fault' && !calendar.assist.isRestDay && !calendar.assist.isFutureDay && !calendar.assist.isWorkDisabilityDate && !calendar.assist.isVacationDate) {
              assist.employee.faultDays.push({
                day: DateTime.fromISO(calendar.day).setLocale('en').toFormat('DDD')
              })
            }
          }

          this.employeesWithFaults.push(assist.employee)
        }
      }

      const departmentId = null
      const positionId = null
      const empsLimit = this.$config.public.ENVIRONMENT === 'production' ? 99999999999 : 99999999999
      const response = await new EmployeeService().getFilteredList('', departmentId, positionId, null, 1, empsLimit, false, null)
      const employeeDepartmentPositionList = (response.status === 200 ? response._data.data.employees.data : []) as EmployeeInterface[]
      this.employeeDiscrimitorsList = employeeDepartmentPositionList.map((employee) => ({ employee, assistStatistics: new AssistStatistic().toModelObject(), calendar: [] }))

      this.employeeDiscrimitorsList = this.employeeDiscrimitorsList.filter(emp => emp.employee.employeeAssistDiscriminator === 1)

      await Promise.all(this.employeeDiscrimitorsList.map(emp => this.getEmployeeAssistCalendar(emp)))

      for await (const assist of this.employeeDiscrimitorsList) {
        assist.employee.faultDays = []
        if (assist.calendar.length > 0) {
          let noCheckStreak = 0
          const sortedCalendar = assist.calendar

          for (const calendar of sortedCalendar) {
            const noChecks = !calendar.assist.checkIn &&
              !calendar.assist.checkOut &&
              !calendar.assist.checkEatIn &&
              !calendar.assist.checkEatOut && !calendar.assist.isRestDay && !calendar.assist.isFutureDay && !calendar.assist.isWorkDisabilityDate && !calendar.assist.isVacationDate

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
      this.drawerEmployeeWithFaults = true
      myGeneralStore.setFullLoader(false)
    },
    async getExcelAllAssistance() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const rows = [] as AssistExcelRowInterface[]
      const workbook = new ExcelJS.Workbook()
      let worksheet = workbook.addWorksheet('Assistance Report')
      /*  const assistExcelImageInterface = {
         workbook: workbook,
         worksheet: worksheet,
         col: 0.28,
         row: 0.7,
       } as AssistExcelImageInterface */
      await this.addImageLogo(workbook, worksheet)
      worksheet.getRow(1).height = 60
      worksheet.mergeCells('A1:Q1')
      const titleRow = worksheet.addRow(['Assistance Report'])
      let color = '244062'
      let fgColor = 'FFFFFFF'
      worksheet.getCell('A' + 2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
      titleRow.font = { bold: true, size: 24, color: { argb: fgColor } }
      titleRow.height = 42
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
      worksheet.mergeCells('A2:Q2')
      color = '366092'
      const periodRow = worksheet.addRow([this.lineChartTitle])
      periodRow.font = { size: 15, color: { argb: fgColor } }

      worksheet.getCell('A' + 3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
      periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
      periodRow.height = 30
      worksheet.mergeCells('A3:Q3')
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }, // Fija la primera fila
        { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
        { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
        { state: 'frozen', ySplit: 4 }, // Fija la cuarta fila
      ]
      // Añadir columnas de datos (encabezados)
      this.addHeadRow(worksheet)
      const assists = await this.getDepartmentPositionAssistStatistics()
      assists.sort((a, b) => a.department.departmentId - b.department.departmentId);
      console.log(assists)
      for await (const assist of assists) {
        for await (const employee of assist.employees) {
          const newRows = await this.addRowCalendar(employee.employee, employee.calendar)
          for await (const row of newRows) {
            rows.push(row)
          }
        }

      }
      await this.addRowToWorkSheet(rows, worksheet)
      // Convertir a blob y guardar
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, 'Assistance Report.xlsx')
      myGeneralStore.setFullLoader(false)
    },
    async addImageLogo(workbook: ExcelJS.Workbook, worksheet: ExcelJS.Worksheet) {
      const imageLogoUrl = await 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.webp'//getLogo()
      const imageResponse = await axios.get(imageLogoUrl, { responseType: 'arraybuffer' })
      const imageBuffer = imageResponse.data

      // Convertir imagen a base64 para obtener dimensiones
      const blob = new Blob([imageBuffer])
      const image = new Image();
      const imageUrl = URL.createObjectURL(blob)

      await new Promise((resolve) => {
        image.onload = resolve
        image.src = imageUrl
      })

      const imageWidth = image.width
      const imageHeight = image.height

      const targetWidth = 139
      const targetHeight = 49

      const scale = Math.min(targetWidth / imageWidth, targetHeight / imageHeight)
      let adjustedWidth = imageWidth * scale
      let adjustedHeight = imageHeight * scale

      const col = 0
      if (col === 0) {
        const increaseFactor = 1.3
        adjustedWidth *= increaseFactor
        adjustedHeight *= increaseFactor
      }

      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      })

      worksheet.addImage(imageId, {
        tl: { col, row: 0 },
        ext: { width: adjustedWidth, height: adjustedHeight },
      })
    },
    addHeadRow(worksheet: ExcelJS.Worksheet) {
      const headerRow = worksheet.addRow([
        'Employee ID',
        'Employee Name',
        'Department',
        'Position',
        'Date',
        '',
        'Shift Assigned',
        'Shift Start Date',
        'Shift Ends Date',
        '',
        'Check-in',
        'Check go Eat',
        'Check back from Eat',
        'Check-out',
        'Hours worked',
        'Status',
        'Exception Notes',
      ])
      let fgColor = 'FFFFFFF'
      let color = '538DD5'
      for (let col = 1; col <= 6; col++) {
        const cell = worksheet.getCell(4, col)
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: color },
        }
      }
      color = '16365C'
      for (let col = 7; col <= 9; col++) {
        const cell = worksheet.getCell(4, col)
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: color },
        }
      }
      color = '538DD5'
      for (let col = 10; col <= 17; col++) {
        const cell = worksheet.getCell(4, col)
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: color },
        }
      }
      headerRow.height = 30
      headerRow.font = { bold: true, color: { argb: fgColor } }
      const columnA = worksheet.getColumn(1)
      columnA.width = 20
      columnA.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnB = worksheet.getColumn(2)
      columnB.width = 44
      columnB.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnC = worksheet.getColumn(3)
      columnC.width = 44
      columnC.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnD = worksheet.getColumn(4)
      columnD.width = 44
      columnD.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnE = worksheet.getColumn(5)
      columnE.width = 25
      columnE.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnF = worksheet.getColumn(6)
      columnF.width = 5
      columnF.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnG = worksheet.getColumn(7)
      columnG.width = 25
      columnG.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnH = worksheet.getColumn(8)
      columnH.width = 25
      columnH.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnI = worksheet.getColumn(9)
      columnI.width = 25
      columnI.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnJ = worksheet.getColumn(10)
      columnJ.width = 5
      columnJ.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnK = worksheet.getColumn(11)
      columnK.width = 25
      columnK.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnL = worksheet.getColumn(12)
      columnL.width = 25
      columnL.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnM = worksheet.getColumn(13)
      columnM.width = 25
      columnM.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnN = worksheet.getColumn(14)
      columnN.width = 25
      columnN.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnO = worksheet.getColumn(15)
      columnO.width = 25
      columnO.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnP = worksheet.getColumn(16)
      columnP.width = 30
      columnP.alignment = { vertical: 'middle', horizontal: 'center' }
      const columnQ = worksheet.getColumn(17)
      columnQ.width = 30
      columnQ.alignment = { vertical: 'middle', horizontal: 'center' }
    },
    async addRowCalendar(employee: EmployeeInterface, employeeCalendar: AssistDayInterface[]) {
      const rows = [] as AssistExcelRowInterface[]
      for await (const calendar of employeeCalendar) {
        const exceptions = [] as ShiftExceptionInterface[]
        if (calendar.assist.exceptions.length > 0) {
          for await (const exception of calendar.assist.exceptions) {
            exceptions.push(exception)
          }
        }
        const day = this.dateDay(calendar.day)
        const month = this.dateMonth(calendar.day)
        const year = this.dateYear(calendar.day)
        const calendarDay = this.calendarDayMonth(year, month, day)
        const firstCheck = this.chekInTime(calendar)
        const lastCheck = this.chekOutTime(calendar)
        let status = calendar.assist.checkInStatus
          ? `${calendar.assist.checkInStatus}`.toUpperCase()
          : ''
        if (calendar.assist.isFutureDay) {
          status = 'NEXT'
        } else if (calendar.assist.isRestDay && !firstCheck) {
          status = 'REST'
        } else if (calendar.assist.isVacationDate) {
          status = 'VACATIONS'
        } else if (calendar.assist.isHoliday) {
          status = 'HOLIDAY'
        }
        if (!calendar.assist.dateShift) {
          status = ''
        }
        let department = employee.department?.departmentAlias
          ? employee.department.departmentAlias
          : ''
        department =
          department === '' && employee.department?.departmentName
            ? employee.department.departmentName
            : ''
        let position = employee.position?.positionAlias ? employee.position.positionAlias : ''
        position =
          position === '' && employee.position?.positionName ? employee.position.positionName : ''
        let shiftName = ''
        let shiftStartDate = ''
        let shiftEndsDate = ''
        let hoursWorked = 0
        if (calendar && calendar.assist && calendar.assist.dateShift) {
          shiftName = calendar.assist.dateShift.shiftName
          shiftStartDate = calendar.assist.dateShift.shiftTimeStart
          const hoursToAddParsed = 0
          const time = DateTime.fromFormat(shiftStartDate, 'HH:mm:ss')
          const newTime = time.plus({ hours: hoursToAddParsed })
          shiftEndsDate = newTime.toFormat('HH:mm:ss')
        }

        const checkInTime = calendar.assist.checkIn?.assistPunchTimeUtc
        const checkOutTime = calendar.assist.checkOut?.assistPunchTimeUtc

        const firstCheckTime = checkInTime ? DateTime.fromISO(checkInTime.toString(), { zone: 'UTC-6' }) : null
        const lastCheckTime = checkOutTime ? DateTime.fromISO(checkOutTime.toString(), { zone: 'UTC-6' }) : null

        if (firstCheckTime && lastCheckTime && firstCheckTime.isValid && lastCheckTime.isValid) {
          const durationInMinutes = lastCheckTime.diff(firstCheckTime, 'minutes').as('minutes')
          let hours = Math.floor(durationInMinutes / 60)
          let minutes = Math.round(durationInMinutes % 60)
          if (minutes >= 60) {
            hours += Math.floor(minutes / 60)
            minutes = minutes % 60
          }
          const timeInDecimal = hours + minutes / 60
          hoursWorked += timeInDecimal
        }

        const rowCheckInTime = calendar.assist.checkIn?.assistPunchTimeUtc && !calendar.assist.isFutureDay ? DateTime.fromISO(calendar.assist.checkIn.assistPunchTimeUtc.toString(), { setZone: true }).setZone('UTC-6').toFormat('ff') : ''
        const rowLunchTime = calendar.assist?.checkEatIn?.assistPunchTimeUtc ? DateTime.fromISO(calendar.assist.checkEatIn.assistPunchTimeUtc.toString(), { setZone: true }).setZone('UTC-6').toFormat('MMM d, yyyy, h:mm:ss a') : ''
        const rowReturnLunchTime = calendar?.assist?.checkEatOut?.assistPunchTimeUtc ? DateTime.fromISO(calendar.assist.checkEatOut.assistPunchTimeUtc.toString(), { setZone: true }).setZone('UTC-6').toFormat('MMM d, yyyy, h:mm:ss a') : ''
        const rowCheckOutTime = calendar.assist.checkOut?.assistPunchTimeUtc && !calendar.assist.isFutureDay ? DateTime.fromISO(calendar.assist.checkOut?.assistPunchTimeUtc.toString(), { setZone: true }).setZone('UTC-6').toFormat('ff') : ''

        rows.push({
          code: employee.employeeCode.toString(),
          name: `${employee.employeeFirstName} ${employee.employeeLastName}`,
          department: department,
          position: position,
          date: calendarDay,
          shiftAssigned: shiftName,
          shiftStartDate: shiftStartDate,
          shiftEndsDate: shiftEndsDate,
          checkInTime: rowCheckInTime,
          firstCheck: firstCheck,
          lunchTime: rowLunchTime,
          returnLunchTime: rowReturnLunchTime,
          checkOutTime: rowCheckOutTime,
          lastCheck: lastCheck,
          hoursWorked: hoursWorked,
          incidents: status,
          notes: '',
          sundayPremium: '',
          checkOutStatus: calendar.assist.checkOutStatus,
          exceptions: exceptions,
        })
      }
      return rows
    },
    dateYear(day: string) {
      if (!day) {
        return 0
      }

      const year = Number.parseInt(`${day.split('-')[0]}`)
      return year
    },

    dateMonth(day: string) {
      if (!day) {
        return 0
      }

      const month = Number.parseInt(`${day.split('-')[1]}`)
      return month
    },

    dateDay(day: string) {
      if (!day) {
        return 0
      }

      const dayTemp = Number.parseInt(`${day.split('-')[2]}`)
      return dayTemp
    },

    calendarDay(dateYear: number, dateMonth: number, dateDay: number) {
      const date = DateTime.local(dateYear, dateMonth, dateDay, 0)
      const day = date.toFormat('DDD')
      return day
    },

    calendarDayMonth(dateYear: number, dateMonth: number, dateDay: number) {
      const date = DateTime.local(dateYear, dateMonth, dateDay, 0)
      const day = date.toFormat('dd/MMMM')
      return day
    },

    chekInTime(checkAssist: AssistDayInterface) {
      if (!checkAssist?.assist?.checkIn?.assistPunchTimeUtc) {
        return ''
      }
      const timeCheckIn = DateTime.fromISO(
        checkAssist.assist.checkIn.assistPunchTimeUtc.toString(),
        { setZone: true }
      ).setZone('UTC-6')
      return timeCheckIn.toFormat('MMM d, yyyy, h:mm:ss a')
    },

    chekOutTime(checkAssist: AssistDayInterface) {
      if (!checkAssist?.assist?.checkOut?.assistPunchTimeUtc) {
        return ''
      }

      const now = DateTime.now().toFormat('yyyy-LL-dd')
      const timeCheckOut = DateTime.fromISO(
        checkAssist.assist.checkOut.assistPunchTimeUtc.toString(),
        { setZone: true }
      ).setZone('UTC-6')
      if (timeCheckOut.toFormat('yyyy-LL-dd') === now) {
        checkAssist.assist.checkOutStatus = ''
        return ''
      }
      return timeCheckOut.toFormat('MMM d, yyyy, h:mm:ss a')
    },
    async addRowToWorkSheet(
      rows: AssistExcelRowInterface[],
      worksheet: ExcelJS.Worksheet,
      status: string = 'Active'
    ) {
      let rowCount = 5
      let faultsTotal = 0
      for await (const rowData of rows) {
        if (rowData.incidents.toString().toUpperCase() === 'FAULT') {
          faultsTotal += 1
        }
        let incidents =
          !rowData.name && rowData.code !== '0'
            ? faultsTotal.toString().padStart(2, '0') + ' TOTAL FAULTS'
            : rowData.incidents
        worksheet.addRow([
          rowData.code !== '0' ? rowData.code : '',
          rowData.name,
          rowData.department,
          rowData.position,
          rowData.date,
          '',
          rowData.shiftAssigned,
          rowData.shiftStartDate,
          rowData.shiftEndsDate,
          '',
          rowData.firstCheck,
          rowData.lunchTime,
          rowData.returnLunchTime,
          rowData.lastCheck,
          this.decimalToTimeString(rowData.hoursWorked),
          incidents,
          rowData.notes,
        ])
        if (rowData.name) {
          this.paintIncidents(worksheet, rowCount, rowData.incidents)
          this.paintCheckOutStatus(worksheet, rowCount, rowData.checkOutStatus)
          if (status === 'Terminated') {
            await this.paintEmployeeTerminated(worksheet, 'B', rowCount)
          }
        }
        if (rowData.exceptions.length > 0) {
          await this.addExceptions(rowData, worksheet, rowCount)
        }
        if (!rowData.name && rowData.code !== '0') {
          const color = 'FDE9D9'
          for (let col = 1; col <= 17; col++) {
            const cell = worksheet.getCell(rowCount, col)
            const row = worksheet.getRow(rowCount)
            row.height = 21
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color },
            }
          }
          faultsTotal = 0
        }
        rowCount += 1
      }
    },
    decimalToTimeString(decimal: number): string {
      const hours = Math.floor(decimal)
      const minutes = Math.round((decimal - hours) * 60)
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    },
    paintIncidents(worksheet: ExcelJS.Worksheet, row: number, value: string) {
      let color = 'FFFFFFF'
      let fgColor = 'FFFFFFF'
      if (value === 'FAULT') {
        color = 'FFD45633'
        fgColor = 'FFFFFFF'
      } else if (value === 'ONTIME') {
        color = 'FF33D4AD'
        fgColor = 'FFFFFFF'
      } else if (value === 'NEXT') {
        color = 'E4E4E4'
        fgColor = '000000'
      } else if (value === 'REST') {
        color = 'E4E4E4'
        fgColor = '000000'
      } else if (value === 'VACATIONS') {
        color = 'FFFFFFF'
        fgColor = '000000'
      } else if (value === 'HOLIDAY') {
        color = 'FFFFFFF'
        fgColor = '000000'
      } else if (value === 'DELAY') {
        color = 'FF993A'
      } else if (value === 'TOLERANCE') {
        color = '3CB4E5'
      } else if (value === 'EXCEPTION') {
        fgColor = '000000'
      }
      worksheet.getCell('P' + row).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }, // Color de fondo rojo
      }
      worksheet.getCell('P' + row).font = {
        color: { argb: fgColor }, // Color de fondo rojo
      }
    },
    paintCheckOutStatus(worksheet: ExcelJS.Worksheet, row: number, value: string) {
      if (value.toString().toUpperCase() === 'DELAY') {
        const fgColor = 'FF993A'
        worksheet.getCell('N' + row).font = {
          color: { argb: fgColor },
        }
      }
    },
    paintEmployeeTerminated(worksheet: ExcelJS.Worksheet, columnName: string, row: number) {
      const color = 'FFD45633'
      const fgColor = 'FFFFFFF'
      worksheet.getCell(columnName + row).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }, // Color de fondo rojo
      }
      worksheet.getCell(columnName + row).font = {
        color: { argb: fgColor }, // Color de fondo rojo
      }
    },
    async addExceptions(
      rowData: AssistExcelRowInterface,
      worksheet: ExcelJS.Worksheet,
      rowCount: number
    ) {
      const richText = []
      for await (const exception of rowData.exceptions) {
        const type = exception.exceptionType ? exception.exceptionType.exceptionTypeTypeName : ''
        const description = exception.shiftExceptionsDescription
          ? exception.shiftExceptionsDescription
          : ''
        richText.push(
          { text: type, font: { bold: true, size: 12, color: { argb: '000000' } } },
          { text: `\n${description}\n`, font: { italic: true, size: 10, color: { argb: '000000' } } }
        )
      }
      const cell = worksheet.getCell('Q' + rowCount)
      cell.value = {
        richText: richText,
      }
      cell.alignment = { wrapText: true }
    }
  }
})
