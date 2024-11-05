import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { ExceptionRequestInterface } from '~/resources/scripts/interfaces/ExceptionRequestInterface'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'

export default defineComponent({
  name: 'shiftExceptionCard',
  props: {
    shiftException: { type: Object as PropType<ExceptionRequestInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },

    clickOnEditException: { type: Function, default: null },
    clickOnDeleteException: { type: Function, default: null },
  },
  data: () => ({
  }),
  computed: {
    calendarDay () {
      const dateToException = DateTime.fromISO(this.shiftException.requestedDate, { zone: 'utc' })

      return dateToException.setLocale('en').toFormat('DDDD HH:mm')
    },
    formattedRequestedDate() {
      return this.shiftException.requestedDate
      ? DateTime.fromISO(this.shiftException.requestedDate, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss')
      : ''
    },
  },
  mounted() {
    // if (this.shiftException.requestedDate) {
    //   const newDate = DateTime.fromISO(this.shiftException.requestedDate.toString(), { setZone: true }).setZone('America/Mexico_City')
    //   this.shiftException.requestedDate = newDate ? newDate.toString() : ''
    // }
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
    handlerClickOnEditException () {
      if (this.clickOnEditException) {
        this.clickOnEditException()
      }
    },
    handlerClickOnDeleteException () {
      if (this.clickOnDeleteException) {
        this.clickOnDeleteException()
      }
    },
  }
})