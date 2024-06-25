import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/assistDayInterface'

export default defineComponent({
  name: 'attendanceCalendarDay',
  props: {
    checkAssist: { type: Object as PropType<AssistDayInterface>, required: true }
  },
  data: () => ({
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
      return timeCST.toFormat('tt').toString().padStart(13, '0')
    },
    chekOutTime () {
      if (!this.checkAssist?.assist?.check_out?.punchTimeOrigin) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.check_out.punchTimeOrigin.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-5')
      return timeCST.toFormat('tt').toString().padStart(13, '0')
    }
  },
  mounted() {
  },
  methods: {
  }
})