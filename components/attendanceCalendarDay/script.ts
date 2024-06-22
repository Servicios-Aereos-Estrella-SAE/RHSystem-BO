import { DateTime } from 'luxon'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'attendanceCalendarDay',
  props: {
    dateMonth: { type: Number, required: true },
    dateYear: { type: Number, required: true },
    dateDay: { type: Number, required: true }
  },
  data: () => ({
  }),
  computed: {
    weekDayName () {
      const date = DateTime.local(this.dateYear, this.dateMonth, this.dateDay, 0)
      const day = date.toFormat('cccc')
      return day
    }
  },
  mounted() {
  },
  methods: {
  }
})