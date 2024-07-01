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
    minDate: new Date() as Date,
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
  created () {
    const minDateString = '2024-05-01T00:00:00'
    const minDate = new Date(minDateString)
    this.minDate = minDate
  },
  async mounted() {
    this.periodSelected = new Date()
    await this.getEmployee()
    await this.setDefaultVisualizationMode()
    await this.getEmployeeMonthAssist()
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
    },
    checkInStatus (checkAssist: AssistDayInterface) {
      if (!checkAssist?.assist?.check_in) {
        return ''
      }

      const dailyShif = {
        shift_id: 1,
        shift_name: 'Estandar',
        shift_day_start: '1',
        shift_time_start: 8,
        shift_active_hours: 10,
        shift_rest_days: '6,7',
        shift_created_at: '',
        shift_updated_at: '',
        shift_deleted_at: '',
      }

      const dateYear = parseInt(`${checkAssist.day.split('-')[0]}`)
      const dateMonth = parseInt(`${checkAssist.day.split('-')[1]}`)
      const dateDay = parseInt(`${checkAssist.day.split('-')[2]}`)

      const hourStart = dailyShif.shift_time_start.toString().padStart(2, '0')
      const stringDate = `${dateYear.toString().padStart(2, '0')}-${dateMonth.toString().padStart(2, '0')}-${dateDay.toString().padStart(2, '0')}T${hourStart}:00:00`
      const timeToStart = DateTime.fromJSDate(new Date(stringDate))

      const DayTime = DateTime.fromISO(checkAssist.assist.check_in.punchTimeOrigin.toString(), { setZone: true })
      const checkTime = DayTime.setZone('UTC-5')

      const checkTimeTime = checkTime.toFormat('yyyy-LL-dd TT').split(' ')[1]
      const stringInDateString = `${dateYear.toString().padStart(2, '0')}-${dateMonth.toString().padStart(2, '0')}-${dateDay.toString().padStart(2, '0')}T${checkTimeTime}`
      const timeCheckIn = DateTime.fromJSDate(new Date(stringInDateString))

      const diffTime = timeCheckIn.diff(timeToStart, 'minutes').minutes

      if (diffTime <= 0) {
        return 'ontime'
      }

      if (diffTime <= 15) {
        return 'tolerance'
      }

      if (diffTime > 15) {
        return 'delay'
      }

      return ''
    },
    async getEmployeeMonthAssist () {
      const employeeID = this.employee?.employeeId || 0
      const dayStartMonth = this.getWeeksOfMonth()
      const monthWeekDates: any[] = []

      dayStartMonth.forEach((weekNumber) => {
        const dates = this.getStartAndEndOfWeek(2024, weekNumber)
        monthWeekDates.push({
          week: weekNumber,
          dates: dates,
          checks: [],
          assists: 0,
          tolerances: 0,
          delays: 0,
          faults: 0,
        })
      })

      for await (const weekDate of monthWeekDates) {
        const assistReq = await new AssistService().index(weekDate.dates.startOfWeek, weekDate.dates.endOfWeek, employeeID, 1, 1000)
        weekDate.checks = assistReq.status === 200 ? assistReq._data.data.data : []
        
        for await (const checkDate of weekDate.checks) {
          const status = this.checkInStatus(checkDate)
          if (status === 'ontime') { weekDate.assists += 1 }
          if (status === 'tolerance') { weekDate.tolerances += 1 }
          if (status === 'delay') { weekDate.delays += 1 }
          if (status === '') { weekDate.faults += 1 }
        }
      }

      this.periodData.xAxis.categories = monthWeekDates.map(week => `Week ${week.week}`)
      
      const series: any[] = []
      const serieAssist: any[] = []
      const serieTolerance: any[] = []
      const serieDelay: any[] = []
      const serieFault: any[] = []

      monthWeekDates.forEach((weekNumber) => {
        const total = weekNumber.assists + weekNumber.tolerances + weekNumber.delays + weekNumber.faults
        const onTime = weekNumber.assists * 100 / total
        const onTolerance = weekNumber.tolerances * 100 / total
        const onDelay = weekNumber.delays * 100 / total
        const onFault = weekNumber.fauls * 100 / total

        serieAssist.push(onTime)
        serieTolerance.push(onTolerance)
        serieDelay.push(onDelay)
        serieFault.push(onFault)
      })

      series.push({ name: 'Assists', serieAssist, color: '#33D4AD' })
      series.push({ name: 'Tolerances', data: serieTolerance, color: '#3CB4E5' })
      series.push({ name: 'Delays', data: serieDelay, color: '#FF993A' })
      series.push({ name: 'Faults', data: serieFault, color: '#d45633' })

      this.periodData.series = series
    },
    getWeeksOfMonth () {
      // Crear un objeto DateTime desde la fecha proporcionada
      const date = DateTime.fromJSDate(this.periodSelected)
  
      // Obtener el primer y último día del mes
      const startOfMonth = date.startOf('month');
      const endOfMonth = date.endOf('month');
  
      // Inicializar un array para guardar los números de semana
      const weeks: any[] = [];
  
      // Iterar sobre cada día del mes
      let current = startOfMonth;
      while (current <= endOfMonth) {
          // Obtener el número de semana y agregarlo al array si aún no está
          const weekNumber = current.weekNumber;
          if (!weeks.includes(weekNumber)) {
              weeks.push(weekNumber);
          }
          // Avanzar al siguiente día
          current = current.plus({ days: 1 });
      }
  
      return weeks;
    },
    getStartAndEndOfWeek(year: number, weekNumber: number) {
      // Crear un objeto DateTime desde el primer día del año
      const firstDayOfYear = DateTime.fromObject({ year: year, month: 1, day: 1 });
  
      // Calcular la fecha del primer día de la semana especificada
      const startOfWeek = firstDayOfYear.plus({ weeks: weekNumber - 1 }).startOf('week');
  
      // Calcular la fecha del último día de la semana especificada
      const endOfWeek = startOfWeek.endOf('week');
  
      return {
          startOfWeek: startOfWeek.toISODate(), // Convertir a formato ISO (AAAA-MM-DD)
          endOfWeek: endOfWeek.toISODate()      // Convertir a formato ISO (AAAA-MM-DD)
      };
  }
  }
})