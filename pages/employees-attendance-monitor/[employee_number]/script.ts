import { defineComponent } from 'vue'
import moment from 'moment';
import type { VisualizationModeOptionInterface } from '../../../resources/scripts/interfaces/VisualizationModeOptionInterface'
import AttendanceMonitorController from '../../../resources/scripts/controllers/AttendanceMonitorController'
import { DateTime } from 'luxon'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import AssistService from '~/resources/scripts/services/AssistService'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import { useMyGeneralStore } from '~/store/general'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { AssistSyncStatus } from '~/resources/scripts/interfaces/AssistSyncStatus'
import type { AssistInterface } from '~/resources/scripts/interfaces/AssistInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
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
      { name: 'Monthly', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false },
      { name: 'Weekly', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false },
      { name: 'Custom', value: 'custom', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false, number_months: 1 },
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
    drawerAssistForm: false as boolean
  }),
  computed: {
    isRoot () {
      const myGeneralStore = useMyGeneralStore()
      return myGeneralStore.isRoot
    },
    weeklyStartDay () {
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
          const startOfWeek = date.startOf('week').minus( { days: 1 } ) // Inicio de la semana seleccionada
          
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
    calendarTitle () {
      if (this.visualizationMode?.value === 'weekly') {
        const date = DateTime.fromJSDate(this.periodSelected).setZone('America/Mexico_City').setLocale('en')
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

      const date = DateTime.fromJSDate(this.periodSelected).setZone('America/Mexico_City').setLocale('en')
      const start = date.startOf('month')
      const text = start.toFormat('LLLL')

      return `Check in & Check out on ${text}`
    },
    assistSyncStatusDate () {
      if (this.statusInfo) {
        const dateTime = DateTime.fromISO(`${this.statusInfo.assistStatusSyncs.updatedAt}`, { setZone: true }).setZone('America/Mexico_City').setLocale('en')
        const dateTimeFormat = dateTime.toFormat('ff')
        return dateTimeFormat
      }

      return ''
    }
  },
  created () {
    const minDateString = '2024-05-01T00:00:00'
    const minDate = new Date(minDateString)
    this.minDate = minDate
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.periodSelected = new Date()
    await this.setAssistSyncStatus()
    this.datesSelected = this.getDefaultDatesRange()
    await this.getEmployee()
    await this.setDefaultVisualizationMode()
    myGeneralStore.setFullLoader(false)
  },
  methods: {
    async getEmployee () {
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
    isThursday(dateObject: any, addOneMonth = true) {
      const month =  addOneMonth ? dateObject.month + 1 : dateObject.month
      const mydate = dateObject.year + '-' + (month < 10 ? '0'+month : month) + '-' + (dateObject.day < 10 ? '0'+dateObject.day : dateObject.day) + "T00:00:00";
      const weekDayName = moment(mydate).format('dddd');
      return weekDayName === 'Thursday';
      
    },
    async setDefaultVisualizationMode () {
      const index = this.visualizationModeOptions.findIndex(opt => opt.value === 'monthly')

      if (index >= 0) {
        this.visualizationMode = this.visualizationModeOptions[index]
      }

      await this.handlerVisualizationModeChange()
    },
    getDefaultDatesRange() {
      const currentDay = DateTime.now().setZone('America/Mexico_City').endOf('month').toJSDate()
      const previousDay = DateTime.now().setZone('America/Mexico_City').startOf('month').toJSDate()

      return [previousDay, currentDay];
    },
    isValidPeriodSelected() {
      return (this.visualizationMode?.value === 'custom' && this.datesSelected[0] && this.datesSelected[1]) || this.visualizationMode?.value !== 'custom'
    },
    setGeneralData () {
      const assists = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'ontime').length
      const tolerances = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'tolerance').length
      const delays = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'delay').length
      const faults = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'fault' && !assistDate.assist.isFutureDay && !assistDate.assist.isRestDay).length
      const totalAvailable = assists + tolerances + delays + faults
      const serieData = []
      const assist = totalAvailable > 0 ? Math.round((assists / totalAvailable) * 100) : 0;
      const tolerance = totalAvailable > 0 ? Math.round((tolerances / totalAvailable) * 100) : 0;
      const delay = totalAvailable > 0 ? Math.round((delays / totalAvailable) * 100) : 0;
      const fault = totalAvailable > 0 ? Math.round((faults / totalAvailable) * 100) : 0;

      this.onTimePercentage = assist
      this.onTolerancePercentage = tolerance
      this.onDelayPercentage = delay
      this.onFaultPercentage = fault

      serieData.push({ name: 'On time', y: assist, color: '#33D4AD' })
      serieData.push({ name: 'Tolerances', y: tolerance, color: '#3CB4E5' })
      serieData.push({ name: 'Delays', y: delay, color: '#FF993A' })
      serieData.push({ name: 'Faults', y: fault, color: '#d45633' })

      this.generalData.series[0].data = serieData
    },
    async setPeriodData () {
      this.periodData.series = new AttendanceMonitorController().getDepartmentPeriodData(this.visualizationMode?.value || 'weekly', this.periodSelected)
      if (this.visualizationMode?.value !== 'yearly') {
        await this.getEmployeeAssist()
      }
    },
    setPeriodCategories () {
      this.periodData.xAxis.categories = new AttendanceMonitorController().getDepartmentPeriodCategories(this.visualizationMode?.value || 'weekly', this.periodSelected)
    },
    async handlerVisualizationModeChange () {
      if (this.employee) {
        const idx = this.visualizationModeOptions.findIndex(mode => mode.value === this.visualizationMode?.value)
        this.visualizationModeOptions.forEach(mode => mode.selected = false)

        if (idx >= 0) {
          this.visualizationModeOptions[idx].selected =  true
        }

        this.periodSelected = new Date()

        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        await this.getEmployeeAssist()
        myGeneralStore.setFullLoader(false)
      }
    },
    async handlerPeriodChange () {
      if(this.isValidPeriodSelected()) {
        await this.getEmployeeAssist()
      }
    },
    async handlerSearchEmployee(event: any) {
      if (event.query.trim().length) {
        const response = await new EmployeeService().getFilteredList(event.query.trim(), null, null, null, 1, 30)
        const list = response.status === 200 ? response._data.data.employees.data : []
        this.filteredEmployees = list
      }
    },
    onEmployeeSelect () {
      if (this.selectedEmployee && this.selectedEmployee.employeeCode) {
        this.$router.push(`/employees-attendance-monitor/${this.selectedEmployee.employeeCode}`)
      }
    },
    async getEmployeeAssist () {
      if (this.visualizationMode?.value !== 'yearly') {
        await this.getEmployeeCalendar()
      }
    },
    async getEmployeeCalendar () {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      const startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
      const endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      const employeeID = this.employee?.employeeId || 0
      const assistReq = await new AssistService().index(startDay, endDay, employeeID)
      const employeeCalendar = (assistReq.status === 200 ? assistReq._data.data.employeeCalendar : []) as AssistDayInterface[]
      this.employeeCalendar = employeeCalendar
      this.setGeneralData()
      myGeneralStore.setFullLoader(false)
    },
    async syncEmployee() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      const startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
      const endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      const employeeCode = this.employee?.employeeCode || "0"
      await new AssistService().syncEmployee(startDay, endDay, employeeCode)
      await this.getEmployeeCalendar()
      myGeneralStore.setFullLoader(false)
    },
    async getExcel() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      const startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
      const endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      const employeeID = this.employee?.employeeId || 0
      const assistService = new AssistService()
      const assistResponse = await assistService.getExcelByEmployee(startDay, endDay, employeeID)
      if (assistResponse.status === 201) {
        const blob = await assistResponse._data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'Employee Assistance Report.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
    async setAssistSyncStatus () {
      try {
        const res = await new AssistService().syncStatus()
        const statusInfo: AssistSyncStatus = res.status === 200 ? res._data : null
        this.statusInfo = statusInfo
      } catch (error) {}
    },
    addNewAssist () {
      if (this.employee && this.employee.employeeId) {
        const assist = {
          assistEmpId: this.employee.employeeId,
          employeeId: this.employee.employeeId,
        } as AssistInterface
        this.assist = assist
        this.drawerAssistForm = true
      }
    },
    onSaveAssist () {
      this.drawerAssistForm = false
      this.handlerPeriodChange()
    }
  }
})