import { defineComponent } from 'vue'
import moment from 'moment'
import type { VisualizationModeOptionInterface } from '../../../resources/scripts/interfaces/VisualizationModeOptionInterface'
import AttendanceMonitorController from '../../../resources/scripts/controllers/AttendanceMonitorController'
import { DateTime } from 'luxon'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import AssistService from '~/resources/scripts/services/AssistService'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import { useMyGeneralStore } from '~/store/general'
import type { AssistSyncStatus } from '~/resources/scripts/interfaces/AssistSyncStatus'
import type { AssistInterface } from '~/resources/scripts/interfaces/AssistInterface'
import ToleranceService from '~/resources/scripts/services/ToleranceService'
import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'

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
      { name: 'Custom', value: 'custom', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false, number_months: 1 },
      { name: 'Monthly', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false },
      { name: 'Weekly', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false },
      { name: 'Fourteen', value: 'fourteen', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false, number_months: 1 },
    ] as VisualizationModeOptionInterface[],
    visualizationMode: null as VisualizationModeOptionInterface | null,
    periodSelected: new Date() as Date,
    datesSelected: [] as Date[],
    statusList: [{ name: 'All' }, { name: 'Faults' }, { name: 'Delays' }, { name: 'Tolerances' }, { name: 'On time' }] as Array<Object>,
    statusSelected: null as string | null,
    minDate: new Date() as Date,
    maxDate: new Date() as Date,
    selectedEmployee: null as EmployeeInterface | null,
    filteredEmployees: [] as EmployeeInterface[],
    employee: null as EmployeeInterface | null,
    employeeCalendar: [] as AssistDayInterface[],
    onTimePercentage: 0 as number,
    onTolerancePercentage: 0 as number,
    onDelayPercentage: 0 as number,
    onFaultPercentage: 0 as number,
    statusInfo: null as AssistSyncStatus | null,
    assist: null as AssistInterface | null,
    drawerAssistForm: false as boolean,
    tardies: 3,
    faultsDelays: 0,
    workedTime: '',
    workedProductiveTime: '',
    workedActiveTime: '',
    canReadTimeWorked: false,
    canAddAssistManual: false,
    earlyOuts: 0,
    faultsEarlyOuts: 0,
    onEarlyOutPercentage: 0,
    datePay: '' as string,
    onSyncStatus: true,
    disabledNoPaymentDates: [] as Date[],
    drawerVacations: false,
    vacationDateStart: '',
    vacationDateEnd: '',
    employeeCode: ''
  }),
  computed: {
    isRoot() {
      const myGeneralStore = useMyGeneralStore()
      return myGeneralStore.isRoot
    },
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
          break
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
          break
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
          break
        }
        default:
          break
      }

      return daysList
    },
    calendarTitle() {
      if (this.visualizationMode?.value === 'weekly') {
        const date = DateTime.fromJSDate(this.periodSelected).setZone('UTC-6').setLocale('en')
        const start = date.startOf('week')
        const text = `Week #${start.weekNumber}`
        return `Check in & Check out on ${text}`
      }

      if (this.visualizationMode?.value === 'fourteen') {
        // Convertimos la fecha inicio desde weeklyStartDay[0]
        const startDate = DateTime.fromObject({
          year: this.weeklyStartDay[0].year,
          month: this.weeklyStartDay[0].month,
          day: this.weeklyStartDay[0].day
        }).minus({ days: 1 }).setLocale('en')

        // Convertimos la fecha fin desde weeklyStartDay[1]
        const endDateObject = this.weeklyStartDay[this.weeklyStartDay.length - 1]
        const endDate = DateTime.fromObject({
          year: endDateObject.year,
          month: endDateObject.month,
          day: endDateObject.day
        }).minus({ days: 1 }).setLocale('en')

        return `Behavior from ${startDate.toFormat('DDD')} to ${endDate.toFormat('DDD')}`
      }

      if (this.visualizationMode?.value === 'custom') {
        const date = DateTime.fromJSDate(this.datesSelected[0]).setLocale('en')
        const dateEnd = DateTime.fromJSDate(this.datesSelected[1]).setLocale('en')
        return `Behavior from ${date.toFormat('DDD')} to ${dateEnd.toFormat('DDD')}`
      }

      const date = DateTime.fromJSDate(this.periodSelected).setZone('UTC-6').setLocale('en')
      const start = date.startOf('month')
      const text = start.toFormat('LLLL')

      return `Check in & Check out on ${text}`
    },
    assistSyncStatusDate() {
      if (this.statusInfo) {
        const dateTime = DateTime.fromISO(`${this.statusInfo.assistStatusSyncs.updatedAt}`, { setZone: true }).setZone('UTC-6').setLocale('en')
        const dateTimeFormat = dateTime.toFormat('ff')
        return dateTimeFormat
      }

      return ''
    }
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
    const permissions = await myGeneralStore.getAccess(firstSegment)

    if (myGeneralStore.isRoot) {
      this.canReadTimeWorked = true
      this.canAddAssistManual = true
    } else {
      this.canReadTimeWorked = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read-time-worked') ? true : false
      this.canAddAssistManual = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'add-assist-manual') ? true : false
    }

    this.periodSelected = new Date()
    this.datesSelected = this.getDefaultDatesRange()

    await this.getEmployee()
    await this.setDefaultVisualizationMode()

    myGeneralStore.setFullLoader(false)
  },
  methods: {
    async getEmployee() {
      const employeCode = this.$route.params.employee_number
      if (employeCode) {
        const employeeResponse = await new EmployeeService().getByCode(parseInt(employeCode.toString()))
        if (employeeResponse?.status === 200) {
          const employee = employeeResponse._data.data.employee
          this.employee = employee
        }
      }

      if (!this.employee) {

        if (!this.employee) {
          const myGeneralStore = useMyGeneralStore()
          myGeneralStore.setFullLoader(false)
          throw showError({
            statusCode: 404,
            fatal: true,
            message: 'Employee not found'
          })
        }
      }
    },
    async setDefaultVisualizationMode() {
      const index = this.visualizationModeOptions.findIndex(opt => opt.value === 'custom')

      if (index >= 0) {
        this.visualizationMode = this.visualizationModeOptions[index]
      }

      await this.handlerVisualizationModeChange()
    },
    isThursday(dateObject: any, addOneMonth = true) {
      const month = addOneMonth ? dateObject.month + 1 : dateObject.month
      const mydate = dateObject.year + '-' + (month < 10 ? '0' + month : month) + '-' + (dateObject.day < 10 ? '0' + dateObject.day : dateObject.day) + "T00:00:00"
      const weekDayName = moment(mydate).format('dddd')
      return weekDayName === 'Thursday'
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
    getDefaultDatesRange() {
      const currentDay = DateTime.now().setZone('UTC-6').endOf('month').toJSDate()
      const previousDay = DateTime.now().setZone('UTC-6').startOf('month').toJSDate()

      return [previousDay, currentDay]
    },
    isValidPeriodSelected() {
      return (this.visualizationMode?.value === 'custom' && this.datesSelected[0] && this.datesSelected[1]) || this.visualizationMode?.value !== 'custom'
    },
    setGeneralData() {
      const assists = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'ontime').length
      const tolerances = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'tolerance').length
      const delays = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'delay').length
      this.earlyOuts = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkOutStatus === 'delay').length
      const faults = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'fault' && !assistDate.assist.isFutureDay && !assistDate.assist.isRestDay && assistDate.assist.dateShift).length
      const totalAvailable = assists + tolerances + delays + faults

      const serieData = []

      const assist = totalAvailable > 0 ? Math.round((assists / totalAvailable) * 100) : 0
      const tolerance = totalAvailable > 0 ? Math.round((tolerances / totalAvailable) * 100) : 0
      const delay = totalAvailable > 0 ? Math.round((delays / totalAvailable) * 100) : 0
      const earlyOut = totalAvailable > 0 ? Math.round((this.earlyOuts / totalAvailable) * 100) : 0
      const fault = totalAvailable > 0 ? Math.round((faults / totalAvailable) * 100) : 0

      this.onTimePercentage = assist
      this.onTolerancePercentage = tolerance
      this.onDelayPercentage = delay
      this.onEarlyOutPercentage = earlyOut
      this.onFaultPercentage = fault

      serieData.push({ name: 'On time', y: assist, color: '#33D4AD' })
      serieData.push({ name: 'Tolerances', y: tolerance, color: '#3CB4E5' })
      serieData.push({ name: 'Delays', y: delay, color: '#FF993A' })
      serieData.push({ name: 'Faults', y: fault, color: '#d45633' })

      this.generalData.series[0].data = serieData
    },
    async setPeriodData() {
      this.periodData.series = new AttendanceMonitorController().getDepartmentPeriodData(this.visualizationMode?.value || 'weekly', this.periodSelected)
      if (this.visualizationMode?.value !== 'yearly') {
        await this.getEmployeeAssist()
      }
    },
    setPeriodCategories() {
      this.periodData.xAxis.categories = new AttendanceMonitorController().getDepartmentPeriodCategories(this.visualizationMode?.value || 'weekly', this.periodSelected)
    },
    async onHandlerVisualizationModeChange() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      await this.handlerVisualizationModeChange()
      myGeneralStore.setFullLoader(false)
    },
    async handlerVisualizationModeChange() {
      if (this.employee) {
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

        await this.getEmployeeAssist()
      }
    },
    async handlerPeriodChange() {
      if (this.isValidPeriodSelected()) {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        await this.getEmployeeAssist()
        myGeneralStore.setFullLoader(false)
      }
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
    async getEmployeeAssist() {
      if (this.visualizationMode?.value !== 'yearly') {
        await this.getEmployeeCalendar()
      }
    },
    async getEmployeeCalendar() {
      const toleranceService = new ToleranceService()
      const toleranceResponse = await toleranceService.getTardinessTolerance()
      if (toleranceResponse.status === 200) {
        const tolerance = toleranceResponse._data.data.tardinessTolerance
        if (tolerance) {
          this.tardies = tolerance.toleranceMinutes
        }
        if (this.tardies === 0) {
          this.tardies = 3
        }
      }
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
        const endDayMinusOne = endDate//.minus({ days: 1 })
        startDay = startDayMinusOne.toFormat('yyyy-MM-dd')
        endDay = endDayMinusOne.toFormat('yyyy-MM-dd')
      } else {
        const endDate = DateTime.fromObject({
          year: lastDay.year,
          month: lastDay.month,
          day: lastDay.day,
        }).plus({ days: 1 })
        startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`

        endDay = `${endDate.year}-${`${endDate.month}`.padStart(2, '0')}-${`${endDate.day}`.padStart(2, '0')}`
      }

      const employeeID = this.employee?.employeeId || 0
      const assistReq = await new AssistService().index(startDay, endDay, employeeID)
      const employeeCalendar = (assistReq.status === 200 ? assistReq._data.data.employeeCalendar : []) as AssistDayInterface[]
      this.employeeCalendar = employeeCalendar
      if (this.employeeCalendar.length > 0) {
        this.employeeCalendar.pop()
      }
      let delays = 0
      const assistArray = [] as Array<{
        checkIn: { assistPunchTime?: string | null }
        checkOut: { assistPunchTime?: string | null }
        checkEatIn: { assistPunchTime?: string | null }
        checkEatOut: { assistPunchTime?: string | null }
      }>
      for await (const day of this.employeeCalendar) {
        if (day.assist.checkIn && day.assist.checkOut && day.assist.checkOut.assistPunchTime) {
          assistArray.push({
            checkIn: {
              assistPunchTime: day.assist.checkIn.assistPunchTime.toString(),
            },
            checkOut: {
              assistPunchTime: day.assist.checkOut.assistPunchTime.toString(),
            },
            checkEatIn: {
              assistPunchTime: day.assist.checkEatIn ? day.assist.checkEatIn.assistPunchTime.toString() : null,
            },
            checkEatOut: {
              assistPunchTime: day.assist.checkEatOut ? day.assist.checkEatOut.assistPunchTime.toString() : null,
            }
          })
        }
        if (day.assist.checkInStatus === 'delay') {
          delays += 1
        }
      }
      this.setGeneralData()
      this.workedTime = await this.calculateTotalElapsedTimeWithCrossing(assistArray)
      this.workedProductiveTime = await this.calculateProductiveElapsedTime(assistArray)
      this.workedActiveTime = await this.sumShiftActiveHours(this.employeeCalendar)
      this.faultsDelays = await this.getFaultsFromDelays(delays)
      this.faultsEarlyOuts = await this.getFaultsFromDelays(this.earlyOuts)
    },
    async calculateTotalElapsedTimeWithCrossing(dataList: Array<{
      checkIn?: { assistPunchTime?: string | null }
      checkOut?: { assistPunchTime?: string | null }
    }>): Promise<string> {
      let totalMinutes = 0
      // Ordenar la lista por fechas de check-in para asegurar la secuencia
      const sortedList = dataList.sort((a, b) => {
        const checkInA = a.checkIn?.assistPunchTime || ''
        const checkInB = b.checkIn?.assistPunchTime || ''
        return DateTime.fromISO(checkInA).toMillis() - DateTime.fromISO(checkInB).toMillis()
      })

      let lastCheckOut: DateTime | null = null

      sortedList.forEach(data => {
        // Determinar las fechas de check-in y check-out
        const checkIn = data.checkIn?.assistPunchTime || null
        const checkOut = data.checkOut?.assistPunchTime || null

        if (checkIn || checkOut) {
          // Parsear las fechas
          const checkInDateTime = checkIn ? DateTime.fromISO(checkIn) : null
          const checkOutDateTime = checkOut ? DateTime.fromISO(checkOut) : null

          const start = checkInDateTime || lastCheckOut
          const end = checkOutDateTime
          if (start && end && end >= start) {
            const duration = end.diff(start, ['minutes'])
            totalMinutes += Math.floor(duration.minutes)
          }

          // Actualizar el último check-out
          lastCheckOut = checkOutDateTime || lastCheckOut
        }
      })

      // Convertir minutos acumulados a horas y minutos
      const totalHours = Math.floor(totalMinutes / 60)
      const remainingMinutes = totalMinutes % 60

      return `${totalHours} hours ${remainingMinutes} minutes`
    },
    async calculateProductiveElapsedTime(dataList: Array<{
      checkIn?: { assistPunchTime?: string | null },
      checkOut?: { assistPunchTime?: string | null },
      checkEatIn?: { assistPunchTime?: string | null },
      checkEatOut?: { assistPunchTime?: string | null }
    }>): Promise<string> {
      let totalMinutes = 0

      // Ordenar la lista por fechas de check-in para asegurar la secuencia
      const sortedList = dataList.sort((a, b) => {
        const checkInA = a.checkIn?.assistPunchTime || ''
        const checkInB = b.checkIn?.assistPunchTime || ''
        return DateTime.fromISO(checkInA).toMillis() - DateTime.fromISO(checkInB).toMillis()
      })

      let lastCheckOut: DateTime | null = null

      sortedList.forEach(data => {
        const checkIn = data.checkIn?.assistPunchTime || null
        const checkOut = data.checkOut?.assistPunchTime || null
        const checkEatIn = data.checkEatIn?.assistPunchTime || null
        const checkEatOut = data.checkEatOut?.assistPunchTime || null

        if (checkIn) {
          const checkInDateTime = DateTime.fromISO(checkIn)
          let end: DateTime | null = null

          // Determinar el tiempo final considerando las horas de comida
          if (checkEatIn && checkEatOut) {
            const checkEatInDateTime = DateTime.fromISO(checkEatIn)
            const checkEatOutDateTime = DateTime.fromISO(checkEatOut)
            if (checkEatOutDateTime >= checkEatInDateTime) {
              end = checkOut ? DateTime.fromISO(checkOut) : checkEatOutDateTime
              const eatDuration = checkEatOutDateTime.diff(checkEatInDateTime, ['minutes'])
              totalMinutes -= Math.floor(eatDuration.minutes)
            }
          } else if (checkEatIn) {
            end = DateTime.fromISO(checkEatIn)
          } else {
            end = checkOut ? DateTime.fromISO(checkOut) : lastCheckOut
          }

          if (end && end >= checkInDateTime) {
            const durationMinutes = Math.floor(end.diff(checkInDateTime, ['minutes']).minutes)
            totalMinutes += durationMinutes
          }

          lastCheckOut = checkOut ? DateTime.fromISO(checkOut) : lastCheckOut
        }
      })

      // Convertir minutos acumulados a horas y minutos
      const totalHours = Math.floor(totalMinutes / 60)
      const remainingMinutes = totalMinutes % 60

      return `${totalHours} hours ${remainingMinutes} minutes`
    },
    sumShiftActiveHours(dataList: AssistDayInterface[]): string {
      // Sumar las horas activas del turno solo si no es un día de descanso
      const totalActiveHours = dataList.reduce((sum, data) => {
        if (!this.calendarIsRestDay(data) && !data.assist.isFutureDay) {
          const shiftActiveHours = data.assist?.dateShift?.shiftActiveHours ? parseFloat(data.assist.dateShift.shiftActiveHours.toString()) : 0
          return sum + shiftActiveHours
        }
        return sum
      }, 0)

      // Convertir a horas y minutos
      const wholeHours = Math.floor(totalActiveHours)
      const fractionalMinutes = Math.round((totalActiveHours - wholeHours) * 60)

      return `${wholeHours} hours ${fractionalMinutes} minutes`
    },
    checkInTime(checkAssist: AssistDayInterface) {
      if (!checkAssist?.assist?.checkIn?.assistPunchTimeUtc) {
        return ''
      }

      const time = DateTime.fromISO(checkAssist.assist.checkIn.assistPunchTimeUtc.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-6')
      return timeCST.setLocale('en').toFormat('TT')
    },
    calendarIsRestDay(checkAssist: AssistDayInterface) {
      const valid = (checkAssist.assist.isRestDay && !this.checkInTime(checkAssist) && checkAssist.assist.checkInStatus !== 'working' && !this.checkInTime(checkAssist) && checkAssist.assist.checkInStatus !== 'rest-working-out')
        && !this.calendarIsHoliday(checkAssist)
        && !this.calendarIsVacationDay(checkAssist)
      return valid
    },
    calendarIsHoliday(checkAssist: AssistDayInterface) {
      const valid = checkAssist.assist.isHoliday
        && checkAssist.assist.holiday
        && !checkAssist.assist.checkIn
      return valid
    },
    calendarIsVacationDay(checkAssist: AssistDayInterface) {
      const valid = checkAssist.assist.isVacationDate && !this.checkInTime(checkAssist) && !this.calendarIsHoliday(checkAssist)
      return valid
    },
    async getFaultsFromDelays(delays: number) {
      const faults = Math.floor(delays / this.tardies) // Cada 3 retardos es 1 falta
      return faults
    },
    async syncEmployee() {
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      const startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
      const endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      const employeeCode = this.employee?.employeeCode || "0"

      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      await new AssistService().syncEmployee(startDay, endDay, employeeCode).catch((e) => {
        this.$toast.add({
          severity: 'error',
          summary: 'Sync assist problems',
          detail: 'The service is down for the moment or there are communication problems with the server.',
          life: 5000,
        })
      }).then(async (res) => {
        if (res && res.status === 200) {
          await this.getEmployeeCalendar()
        }
      }).finally(() => {
        myGeneralStore.setFullLoader(false)
      })
    },
    async getExcel(reportType: string) {
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

      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      const employeeID = this.employee?.employeeId || 0
      const assistService = new AssistService()
      const assistResponse = await assistService.getExcelByEmployee(startDay, endDay, this.datePay, employeeID, reportType)

      if (assistResponse.status === 201) {
        const blob = await assistResponse._data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = url
        link.setAttribute('download', `Employee ${reportType}.xlsx`)

        document.body.appendChild(link)

        link.click()
        document.body.removeChild(link)
      } else {
        const msgError = assistResponse._data.error ? assistResponse._data.error : assistResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: 'Excel assist',
          detail: msgError,
          life: 5000,
        })
      }

      myGeneralStore.setFullLoader(false)
    },
    async setAssistSyncStatus() {
      try {
        const res = await new AssistService().syncStatus()
        const statusInfo: AssistSyncStatus = res.status === 200 ? res._data : null
        this.statusInfo = statusInfo
      } catch (error) { }
      this.onSyncStatus = false
    },
    addNewAssist() {
      if (this.employee && this.employee.employeeId) {
        const assist = {
          assistEmpId: this.employee.employeeId,
          employeeId: this.employee.employeeId,
        } as AssistInterface
        this.assist = assist
        this.drawerAssistForm = true
      }
    },
    async onSaveAssist() {
      if (this.isValidPeriodSelected()) {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)

        await this.getEmployeeAssist()
        myGeneralStore.setFullLoader(false)
      }

      this.drawerAssistForm = false
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
      const employeCode = this.$route.params.employee_number
      if (!employeCode) {
        return []
      }
      if (!this.periodSelected && !this.datesSelected.length) {
        return []
      }
      this.employeeCode = employeCode.toString()
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
    }
  }
})
