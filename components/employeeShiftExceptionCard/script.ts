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
    calendarDay () {
      const dateToException = DateTime.fromISO(`${this.shiftException.shiftExceptionsDate}`, { setZone: true }).setZone(
        'America/Mexico_City'
      )
      return dateToException.setLocale('en').toFormat('DDDD')
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