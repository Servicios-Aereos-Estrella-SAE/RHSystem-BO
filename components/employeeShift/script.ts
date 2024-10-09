import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon';
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface';
import ShiftService from '~/resources/scripts/services/ShiftService';
import AssistService from '~/resources/scripts/services/AssistService';
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeShiftCalendarControl',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    shiftsList: [] as ShiftInterface[],
    employeeCalendar: [] as AssistDayInterface[],
    selectedDate: DateTime.now() as DateTime,
    inputSelectedDate: new Date(),
    displayInputCalendar: false as boolean,
    displayCalendar: false,
    drawerShiftExceptions: false,
    selectedExceptionDate: new Date() as Date,
    displaySidebarVacations: false as boolean,
    displaySidebarVacationsManager: false as boolean
  }),
  computed: {
    monthName () {
      const calendarDate = this.selectedDate.setZone('America/Mexico_City').setLocale('en')
      return calendarDate.toFormat('LLLL, y')
    },
    period () {
      const daysList =[]

      const start = this.selectedDate.startOf('month')
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

      return daysList
    },
  },
  created () {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    await Promise.all([
      this.getShifts(),
      this.getEmployeeCalendar()
    ])

    myGeneralStore.setFullLoader(false)
    this.isReady = true
   
  },
  methods: {
    async getShifts() {
      const response = await new ShiftService().getFilteredList('', 1, 999999)
      const list = response.status === 200 ? response._data.data.data : []
      this.shiftsList = list
    },
    async onSuccessShiftAssigned(employeeShiftResponse: any) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      await this.getEmployeeCalendar()

      this.$toast.add({
        severity: 'success',
        summary: 'Employee shift assigned',
        detail: employeeShiftResponse._data.message,
        life: 5000,
      })

      myGeneralStore.setFullLoader(false)
    },
    async getEmployeeCalendar () {
      this.displayCalendar =  false
      const firstDay = this.period[0]
      const lastDay = this.period[this.period.length - 1]

      const startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
      const endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      const employeeID = this.employee?.employeeId || 0
      const assistReq = await new AssistService().index(startDay, endDay, employeeID)
      const employeeCalendar = (assistReq.status === 200 ? assistReq._data.data.employeeCalendar : []) as AssistDayInterface[]
      this.employeeCalendar = employeeCalendar.length > 0 ? employeeCalendar : this.getFakeEmployeeCalendar()
      this.displayCalendar =  true
    },
    async handlerCalendarChange () {
      const calendarDate = DateTime.fromJSDate(this.inputSelectedDate).setZone('America/Mexico_City').setLocale('en')

      if (calendarDate.toFormat('LLLL').toLocaleLowerCase() !== this.selectedDate.toFormat('LLLL').toLocaleLowerCase()) {
        this.selectedDate = calendarDate
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        this.displayInputCalendar = false
        await this.getEmployeeCalendar()
        myGeneralStore.setFullLoader(false)
      }
    },
    async handlerLastMonth () {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.selectedDate = this.selectedDate.plus({ month: -1 }).setZone('America/Mexico_City').setLocale('en')
      await this.getEmployeeCalendar()
      myGeneralStore.setFullLoader(false)
    },
    async handlerNextMonth () {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.selectedDate = this.selectedDate.plus({ month: 1 }).setZone('America/Mexico_City').setLocale('en')
      await this.getEmployeeCalendar()
      myGeneralStore.setFullLoader(false)
    },
    getFakeEmployeeCalendar () {
      const assistCalendar: AssistDayInterface[] = []

      this.period.forEach((periodDay) => {
        const assistDay: AssistDayInterface = {
          day: `${periodDay.year}-${`${periodDay.month}`.padStart(2, '0')}-${`${periodDay.day}`.padStart(2, '0')}`,
          assist: {
            checkIn: null,
            checkOut: null,
            checkEatIn: null,
            checkEatOut: null,
            dateShift: null,
            dateShiftApplySince: '',
            shiftCalculateFlag: '',
            checkInDateTime: '',
            checkOutDateTime: '',
            checkInStatus: '',
            checkOutStatus: '',
            isFutureDay: false,
            isSundayBonus: false,
            isRestDay: false,
            isVacationDate: false,
            isHoliday: false,
            holiday: null,
            hasExceptions: false,
            exceptions: [],
            assitFlatList: []
          }
        }

        assistCalendar.push(assistDay)
      })

      return assistCalendar
    },
    handlerDisplayInputDate () {
      this.inputSelectedDate = new Date()
      this.displayInputCalendar = true
    },
    handlerCalendarCancel () {
      this.displayInputCalendar = false
    },
    onClickExceptions (employeeCalendar: AssistDayInterface) {
      this.selectedExceptionDate = DateTime.fromISO(`${employeeCalendar.day}T00:00:00.000-06:00`, { setZone: true }).setZone('America/Mexico_City').toJSDate()
      this.drawerShiftExceptions = true
    },
    onClickVacations () {
      this.displaySidebarVacations = true
    },
    handlerVacationsManager () {
      this.displaySidebarVacationsManager = true
    }
  }
})