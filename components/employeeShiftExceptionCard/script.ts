import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'

export default defineComponent({
  name: 'shiftExceptionCard',
  props: {
    shiftException: { type: Object as PropType<ShiftExceptionInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
  },
  data: () => ({
  }),
  computed: {
    dateYear () {
      if (!this.shiftException?.shiftExceptionsDate) {
        return 0
      }

      const year = parseInt(`${this.shiftException.shiftExceptionsDate.toString().split('-')[0]}`)
      return year
    },
    dateMonth () {
      if (!this.shiftException.shiftExceptionsDate) {
        return 0
      }

      const month = parseInt(`${this.shiftException.shiftExceptionsDate.toString().split('-')[1]}`)
      return month
    },
    dateDay () {
      if (!this.shiftException.shiftExceptionsDate) {
        return 0
      }

      const day = parseInt(`${this.shiftException.shiftExceptionsDate.toString().split('-')[2]}`)
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
      const time = DateTime.fromISO(this.shiftException.shiftExceptionsDate.toString())
      const timeCST = time.toFormat('HH:mm:ss')
      return timeCST
    }
  },
  mounted() {
    if (this.shiftException.shiftExceptionsDate) {
      const newDate = DateTime.fromISO(this.shiftException.shiftExceptionsDate.toString(), { setZone: true }).setZone('America/Mexico_City')
      this.shiftException.shiftExceptionsDate = newDate ? newDate.toString() : ''
    }
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
  }
})