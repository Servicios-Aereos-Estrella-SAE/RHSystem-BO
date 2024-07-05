import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import type { DailyEmployeeShiftsInterface } from '~/resources/scripts/interfaces/DailyEmployeeShiftsInterface'
import type { EmployeeShiftInterface } from '~/resources/scripts/interfaces/EmployeeShiftInterface'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'

export default defineComponent({
  name: 'attendanceCalendarDay',
  props: {
    checkAssist: { type: Object as PropType<AssistDayInterface>, required: true }
  },
  data: () => ({
  }),
  computed: {
    dateYear () {
      if (!this.checkAssist?.day) {
        return 0
      }

      const year = parseInt(`${this.checkAssist.day.split('-')[0]}`)
      return year
    },
    dateMonth () {
      if (!this.checkAssist?.day) {
        return 0
      }

      const month = parseInt(`${this.checkAssist.day.split('-')[1]}`)
      return month
    },
    dateDay () {
      if (!this.checkAssist?.day) {
        return 0
      }

      const day = parseInt(`${this.checkAssist.day.split('-')[2]}`)
      return day
    },
    weekDayName () {
      const date = DateTime.local(this.dateYear, this.dateMonth, this.dateDay, 0)
      const day = date.toFormat('cccc')
      return day
    },
    calendarDay () {
      const date = DateTime.local(this.dateYear, this.dateMonth, this.dateDay, 0)
      const day = date.toFormat('DD')
      return day
    },
    chekInTime () {
      if (!this.checkAssist?.assist?.checkIn?.assistPunchTimeOrigin) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.checkIn.assistPunchTimeOrigin.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-5')
      return timeCST.toFormat('tt')
    },
    chekOutTime () {
      if (!this.checkAssist?.assist?.checkOut?.assistPunchTimeOrigin) {
        return ''
      }

      const now = DateTime.now().toFormat('yyyy-LL-dd')
      const time = DateTime.fromISO(this.checkAssist.assist.checkOut.assistPunchTimeOrigin.toString(), { setZone: true })
      const timeDate = time.toFormat('yyyy-LL-dd')
      const timeCST = time.setZone('UTC-5')

      if (timeDate === now) {
        this.checkAssist.assist.checkOutStatus = ''
        return ''
      }

      return timeCST.toFormat('tt')
    }
  },
  mounted() {
  },
  methods: {
  }
})