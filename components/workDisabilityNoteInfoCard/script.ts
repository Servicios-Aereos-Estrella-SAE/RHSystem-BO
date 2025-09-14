import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { WorkDisabilityNoteInterface } from '~/resources/scripts/interfaces/WorkDisabilityNoteInterface'

export default defineComponent({
  name: 'workDisabilityNoteInfoCard',
  setup() {
    const { locale } = useI18n()
    return {
      locale
    }
  },
  props: {
    workDisabilityNote: { type: Object as PropType<WorkDisabilityNoteInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
    canReadOnlyWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false,
    localeToUse: 'en',
  }),
  computed: {
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  mounted() {
  },
  methods: {
    handlerClickOnEdit() {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    getDate(date: string) {
      const dateWorDisabilityNote = DateTime.fromISO(date, { zone: 'utc' })
      const zone = DateTime.local().zoneName
      return dateWorDisabilityNote.setLocale(this.localeToUse).setZone(zone).toFormat('FF')
    },
  }
})