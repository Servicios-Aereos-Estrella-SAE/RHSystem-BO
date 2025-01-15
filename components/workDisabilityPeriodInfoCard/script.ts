import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { WorkDisabilityPeriodInterface } from '~/resources/scripts/interfaces/WorkDisabilityPeriodInterface'

export default defineComponent({
  name: 'workDisabilityPeriodInfoCard',
  props: {
    workDisabilityPeriod: { type: Object as PropType<WorkDisabilityPeriodInterface>, required: true },
    canManageWorkDisability: { type: Boolean, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false, 
  }),
  computed: {
  },
  async mounted() {
  },
  methods: {
    getDate(date: string) {
      const dateWorDisabilityPeriod = DateTime.fromISO(date, { zone: 'utc' })
      return dateWorDisabilityPeriod.setLocale('en').toFormat('DDDD')
    },
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
    openFile() {
      window.open(this.workDisabilityPeriod?.workDisabilityPeriodFile)
    },
  }
})