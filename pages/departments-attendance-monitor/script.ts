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
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'DepartmentsAttendanceMonitor',
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
    statusList: [{ name: 'All' }, { name: 'Faults' }, { name: 'Delays' }, { name: 'Tolerances' }, { name: 'On time' }] as Array<Object>,
    statusSelected: null as string | null,
    visualizationModeOptions: [
      { name: 'Monthly', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false },
      { name: 'Weekly', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false },
      { name: 'Custom', value: 'custom', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false, number_months: 1 },
      { name: 'Fourteen', value: 'fourteen', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false, number_months: 1 },
    ] as VisualizationModeOptionInterface[],
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
    statusInfo: null as AssistSyncStatus | null
  }),
  computed: {
    weeklyStartDay () {
      const daysList = []
      
      if (!this.periodSelected && !this.datesSelected.length) {
        return []
      }

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
          for (let index = 0; index < 13; index++) {
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

      if (this.visualizationMode?.value === 'fourteen') {
        const date = DateTime.fromJSDate(this.periodSelected).setLocale('en')
        return `Behavior in fourteen to ${date.toFormat('DDD')}`
      }

      if (this.visualizationMode?.value === 'custom') {
        const date = DateTime.fromJSDate(this.datesSelected[0]).setLocale('en')
        const dateEnd = DateTime.fromJSDate(this.datesSelected[1]).setLocale('en')
        return `Behavior from ${date.toFormat('DDD')} to ${dateEnd.toFormat('DDD')}`
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
    },
    assistSyncStatusDate () {
      if (this.statusInfo) {
        const dateTime = DateTime.fromISO(`${this.statusInfo.assistStatusSyncs.updatedAt}`, { setZone: true }).setZone('America/Mexico_City')
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
    this.datesSelected = this.getDefaultDatesRange();
    this.setDefaultVisualizationMode()

    await Promise.all([
      this.setAssistSyncStatus(),
      this.setDepartmetList(),
    ])

    await this.setDepartmentPositionEmployeeList()

    this.setGraphsData()
    myGeneralStore.setFullLoader(false)
  },
  methods: {
    setDefaultVisualizationMode () {
      const index = this.visualizationModeOptions.findIndex(opt => opt.value === 'weekly')

      if (index >= 0) {
        this.visualizationMode = this.visualizationModeOptions[index]
      }

      this.handlerVisualizationModeChange()
    },
    isThursday(dateObject: any, addOneMonth = true) {
      const month =  addOneMonth ? dateObject.month + 1 : dateObject.month
      const mydate = dateObject.year + '-' + (month < 10 ? '0'+month : month) + '-' + (dateObject.day < 10 ? '0'+dateObject.day : dateObject.day) + "T00:00:00";
      const weekDayName = moment(mydate).format('dddd');
      return weekDayName === 'Thursday';
    },
    getDefaultDatesRange() {
      const currentDay = DateTime.now().setZone('America/Mexico_City').endOf('week').toJSDate()
      const previousDay = DateTime.now().setZone('America/Mexico_City').startOf('week').toJSDate()

      return [previousDay, currentDay];
    },
    handlerSetInitialDepartmentList () {
      this.departmenSelected = this.departmentCollection.length > 0 ? this.departmentCollection[0] : null
    },
    setGraphsData () {
      this.setPeriodData()
      this.setGeneralData()
    },
    setPeriodCategories () {
      if (this.visualizationMode?.value === 'custom') {
        this.periodData.xAxis.categories = new AttendanceMonitorController().getCustomPeriodCategories(this.datesSelected)
      } else {
        this.periodData.xAxis.categories = new AttendanceMonitorController().getDepartmentPeriodCategories(this.visualizationMode?.value || 'weekly', this.periodSelected)
      }
    },
    isValidPeriodSelected() {
      if(this.visualizationMode?.value === 'fourteen' && !this.isValidFourteen()) {
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
      return (this.visualizationMode?.value === 'custom' && this.datesSelected[0] && this.datesSelected[1]) || this.visualizationMode?.value !== 'custom'
    },
    setGeneralData () {
      const assists = this.employeeDepartmentList.reduce((acc, val) => acc + (val.assistStatistics.onTimePercentage || 0), 0)
      const tolerances = this.employeeDepartmentList.reduce((acc, val) => acc + (val.assistStatistics.onTolerancePercentage || 0), 0)
      const delays = this.employeeDepartmentList.reduce((acc, val) => acc + (val.assistStatistics.onDelayPercentage || 0), 0)
      const faults = this.employeeDepartmentList.reduce((acc, val) => acc + (val.assistStatistics.onFaultPercentage || 0), 0)
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
            periodLenght = 13
          break
        }
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
    async setDepartmetList () {
      const response = await  new DepartmentService().getAllDepartmentList()
      this.departmentList = response.status === 200 ? response._data.data.departments : []
    },
    async handlerVisualizationModeChange () {
      const idx = this.visualizationModeOptions.findIndex(mode => mode.value === this.visualizationMode?.value)
      this.visualizationModeOptions.forEach(mode => mode.selected = false)

      if (idx >= 0) {
        this.visualizationModeOptions[idx].selected =  true
      }

      this.periodSelected = new Date()
    },
    async handlerPeriodChange() {
      if (this.isValidPeriodSelected()) {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        await Promise.all(this.employeeDepartmentList.map(emp => this.getEmployeeAssistCalendar(emp)))
        this.setGraphsData()
        myGeneralStore.setFullLoader(false)
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
    async onInputVisualizationModeChange () {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.handlerVisualizationModeChange()
      await Promise.all(this.employeeDepartmentList.map(emp => this.getEmployeeAssistCalendar(emp)))
      this.setGraphsData()
      myGeneralStore.setFullLoader(false)
    },
    async handlerSearchEmployee(event: any) {
      if (event.query.trim().length) {
        const response = await new EmployeeService().getFilteredList(event.query.trim(), null, null, null, 1, 30)
        const list = response.status === 200 ? response._data.data.employees.data : []
        this.filteredEmployees = list
      }
    },
    async setDepartmentPositionEmployeeList () {
      const positionId = null
      const departmentId = null
      const response = await new EmployeeService().getFilteredList('', departmentId, positionId, null, 1, 999999999)
      const employeeDepartmentPositionList = (response.status === 200 ? response._data.data.employees.data : []) as EmployeeInterface[]
      this.employeeDepartmentList = employeeDepartmentPositionList.map((employee) => ({ employee, assistStatistics: new AssistStatistic ().toModelObject(), calendar: [] }))

      this.employeeDepartmentList = this.employeeDepartmentList.filter(emp => emp.employee.employeeAssistDiscriminator === 0)

      await Promise.all(this.employeeDepartmentList.map(emp => this.getEmployeeAssistCalendar(emp)))
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
    getDepartmentPositionAssistStatistics () {
      const departmentListStatistics: any[] = []

      this.departmentCollection.forEach((department: DepartmentInterface) => {
        const departmentId = department.departmentId
        const list = this.employeeDepartmentList.filter(item => item.employee.departmentId === departmentId)
        const statistics = {
          onTimePercentage: Math.round(list.reduce((acc, val) => acc + val.assistStatistics.onTimePercentage, 0) / list.length) || 0,
          onTolerancePercentage: Math.round(list.reduce((acc, val) => acc + val.assistStatistics.onTolerancePercentage, 0) / list.length) || 0,
          onDelayPercentage: Math.round(list.reduce((acc, val) => acc + val.assistStatistics.onDelayPercentage, 0) / list.length) || 0,
          onFaultPercentage: Math.round(list.reduce((acc, val) => acc + val.assistStatistics.onFaultPercentage, 0) / list.length) || 0,
        }

        
        if(this.isShowByStatusSelected(statistics)) {
          departmentListStatistics.push({
            department: department,
            statistics
          })
        }
      })
      
      return departmentListStatistics
    },
     isShowByStatusSelected(statistics: any) {
      if (this.statusSelected === 'Faults') {
        return statistics?.onFaultPercentage ?? 0 > 0
      } else if (this.statusSelected === 'Delays') {
        return statistics?.onDelayPercentage ?? 0 > 0
      } else if (this.statusSelected === 'Tolerances') {
        return statistics?.onTolerancePercentage ?? 0 > 0
      } else if (this.statusSelected === 'On time') {
        return statistics?.onTimePercentage ?? 0 > 0
      } else if (this.statusSelected === null || this.statusSelected === 'All') {
        return true
      }
      return true
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
    onEmployeeSelect () {
      if (this.selectedEmployee && this.selectedEmployee.employeeCode) {
        this.$router.push(`/employees-attendance-monitor/${this.selectedEmployee.employeeCode}`)
      }
    },
    async setAssistSyncStatus () {
      try {
        const res = await new AssistService().syncStatus()
        const statusInfo: AssistSyncStatus = res.status === 200 ? res._data : null
        this.statusInfo = statusInfo
      } catch (error) {}
    },
    async getExcel() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      const startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
      const endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      
      const assistService = new AssistService()
      const assistResponse = await assistService.getExcelAll(startDay, endDay)
      if (assistResponse.status === 201) {
        const blob = await assistResponse._data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'All Department Assistance Report.xlsx')
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
    }
  }
})