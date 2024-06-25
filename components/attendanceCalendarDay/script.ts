import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'

export default defineComponent({
  name: 'attendanceCalendarDay',
  props: {
    checkAssist: { type: Object as PropType<AssistDayInterface>, required: true }
  },
  data: () => ({
    dailyShif: null as ShiftInterface | null
  }),
  computed: {
    dateYear () {
      if (!this.checkAssist) {
        return 0
      }

      const year = parseInt(`${this.checkAssist.day.split('-')[0]}`)
      return year
    },
    dateMonth () {
      if (!this.checkAssist) {
        return 0
      }

      const month = parseInt(`${this.checkAssist.day.split('-')[1]}`)
      return month
    },
    dateDay () {
      if (!this.checkAssist) {
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
    chekInTime () {
      if (!this.checkAssist?.assist?.check_in?.punchTimeOrigin) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.check_in.punchTimeOrigin.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-5')
      return timeCST.toFormat('tt')
    },
    chekOutTime () {
      if (!this.checkAssist?.assist?.check_out?.punchTimeOrigin) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.check_out.punchTimeOrigin.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-5')
      return timeCST.toFormat('tt')
    },
    checInStatus () {
      if (!this.dailyShif) {
        return ''
      }

      if (!this.checkAssist?.assist?.check_in?.punchTimeOrigin) {
        return ''
      }

      const hourStart = this.dailyShif.shift_time_start.toString().padStart(2, '0')
      const stringDate = `${this.dateYear.toString().padStart(2, '0')}-${this.dateMonth.toString().padStart(2, '0')}-${this.dateDay.toString().padStart(2, '0')}T${hourStart}:00:00`
      const timeToStart = DateTime.fromJSDate(new Date(stringDate))

      const DayTime = DateTime.fromISO(this.checkAssist.assist.check_in.punchTimeOrigin.toString(), { setZone: true })
      const checkTime = DayTime.setZone('UTC-5')

      const checkTimeTime = checkTime.toFormat('yyyy-LL-dd TT').split(' ')[1]
      const stringInDateString = `${this.dateYear.toString().padStart(2, '0')}-${this.dateMonth.toString().padStart(2, '0')}-${this.dateDay.toString().padStart(2, '0')}T${checkTimeTime}`
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
    checOutStatus () {
      if (!this.dailyShif) {
        return ''
      }

      if (!this.checkAssist?.assist?.check_out?.punchTimeOrigin) {
        return ''
      }

      const hourStart = '18'
      const stringDate = `${this.dateYear.toString().padStart(2, '0')}-${this.dateMonth.toString().padStart(2, '0')}-${this.dateDay.toString().padStart(2, '0')}T${hourStart}:00:00`
      const timeToEnd = DateTime.fromJSDate(new Date(stringDate))

      const DayTime = DateTime.fromISO(this.checkAssist.assist.check_out.punchTimeOrigin.toString(), { setZone: true })
      const checkTime = DayTime.setZone('UTC-5')
      const checkTimeTime = checkTime.toFormat('yyyy-LL-dd TT').split(' ')[1]
      const stringOutDateString = `${this.dateYear.toString().padStart(2, '0')}-${this.dateMonth.toString().padStart(2, '0')}-${this.dateDay.toString().padStart(2, '0')}T${checkTimeTime}`
      const timeCheckOut = DateTime.fromJSDate(new Date(stringOutDateString))

      const diffTime = timeToEnd.diff(timeCheckOut, 'minutes').minutes

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
    }
  },
  mounted() {
    this.dailyShif = {
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
  },
  methods: {
  }
})