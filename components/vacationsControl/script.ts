import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'

export default defineComponent({
  components: {
  },
  name: 'vacationsControl',
  props: {
    shiftException: { type: Object as PropType<ShiftExceptionInterface>, required: true },
  },
  data: () => ({
    shiftExceptionsDate: '',
    displayForm: false as boolean
  }),
  watch: {
    'shiftException.shiftExceptionsDate' (val: Date) {
      this.shiftExceptionsDate = this.getDateFormatted(val)
    },
  },
  computed: {
  },
  async mounted() {
    if (this.shiftException.shiftExceptionsDate) {
      const shiftExceptionsDate = DateTime.fromISO(this.shiftException.shiftExceptionsDate.toString(), { setZone: true })
      .setZone('America/Mexico_City')
      .setLocale('en')
      .toJSDate()
      this.shiftException.shiftExceptionsDate = shiftExceptionsDate
    this.shiftExceptionsDate = this.getDateFormatted(this.shiftException.shiftExceptionsDate as Date)
    }
   
  },
  methods: {
    getDateFormatted (date: Date) {
      if (!date) {
        return ''
      }
      console.log(date)
      return DateTime.fromJSDate(date)
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toFormat('DDD')
    }
  }
})