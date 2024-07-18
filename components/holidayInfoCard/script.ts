import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import HolidayInterface from '~/resources/scripts/interfaces/HolidayInterface'
import { format } from 'date-fns'

export default defineComponent({
  name: 'holidayInfoCard',
  props: {
    holiday: { type: Object as PropType<HolidayInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    clickOnPhoto: { type: Function, default: null }
  },
  data: () => ({
  }),
  computed: {
  },
  mounted() {},
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    onClickPhoto() {
      this.clickOnPhoto()
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    formatDate(date: Date | string) {
      const _date = new Date(date)
      const dtDateOnly = new Date(_date.valueOf() + _date.getTimezoneOffset() * 60 * 1000);
      return format(dtDateOnly, 'eeee, MMMM do, yyyy')
    }
  }
})