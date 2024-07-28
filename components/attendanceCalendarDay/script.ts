import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import Tooltip from 'primevue/tooltip';
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface';

export default defineComponent({
  name: 'attendanceCalendarDay',
  directives: {
    tooltip: Tooltip
  },
  props: {
    checkAssist: { type: Object as PropType<AssistDayInterface>, required: true }
  },
  data: () => ({
    commentsSidebar: false as boolean,
    dayExceptions: [] as ShiftExceptionInterface[]
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
    chekEatInTime () {
      if (!this.checkAssist?.assist?.checkEatIn?.assistPunchTimeOrigin) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.checkEatIn.assistPunchTimeOrigin.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-5')
      return timeCST.toFormat('tt')
    },
    chekEatOutTime () {
      if (!this.checkAssist?.assist?.checkEatOut?.assistPunchTimeOrigin) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.checkEatOut.assistPunchTimeOrigin.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-5')
      return timeCST.toFormat('tt')
    },
    chekOutTime () {
      const now = DateTime.now().setZone('UTC-5')
      const timeToCheckOut = DateTime.fromISO(this.checkAssist.assist.checkOutDateTime.toString(), { setZone: true }).setZone('UTC-5')

      if (timeToCheckOut > now) {
        this.checkAssist.assist.checkOutStatus = ''
        return ''
      }

      if (!this.checkAssist?.assist?.checkOut?.assistPunchTimeOrigin) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.checkOut.assistPunchTimeOrigin.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-5')
      const timeFormatted = timeCST.toFormat('tt')
      return timeFormatted
    }
  },
  mounted() {
  },
  methods: {
    displayExceptionComments (checkAssist: AssistDayInterface) {
      if (checkAssist.assist.hasExceptions) {
        this.commentsSidebar = true
        this.dayExceptions = checkAssist.assist.exceptions.length > 0 ? checkAssist.assist.exceptions : []
      }
    }
  }
})