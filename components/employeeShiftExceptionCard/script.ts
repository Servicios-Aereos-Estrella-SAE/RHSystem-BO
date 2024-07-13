import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'

export default defineComponent({
  name: 'shiftExceptionCard',
  props: {
    shiftException: { type: Object as PropType<ShiftExceptionInterface>, required: true }
  },
  data: () => ({
  }),
  computed: {
    dateYear () {
      if (!this.shiftException?.shiftExceptionsDate) {
        return 0
      }

      const year = parseInt(`${this.shiftException.shiftExceptionsDate.split('-')[0]}`)
      return year
    },
    dateMonth () {
      if (!this.shiftException.shiftExceptionsDate) {
        return 0
      }

      const month = parseInt(`${this.shiftException.shiftExceptionsDate.split('-')[1]}`)
      return month
    },
    dateDay () {
      if (!this.shiftException.shiftExceptionsDate) {
        return 0
      }

      const day = parseInt(`${this.shiftException.shiftExceptionsDate.split('-')[2]}`)
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
      if (!this.shiftException.shiftExceptionsDate) {
        return ''
      }

      const time = DateTime.fromISO(this.shiftException.shiftExceptionsDate.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-5')
      return timeCST.toFormat('tt')
    }
  },
  mounted() {
    console.log(this.shiftException)
    console.log('sdddds')
  },
  methods: {
  }
})