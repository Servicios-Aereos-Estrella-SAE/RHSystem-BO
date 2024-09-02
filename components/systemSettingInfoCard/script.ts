import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SystemSettingInterface } from '~/resources/scripts/interfaces/SystemSettingInterface'

export default defineComponent({
  name: 'SystemSettingInfoCard',
  props: {
    systemSetting: { type: Object as PropType<SystemSettingInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }
  },
  data: () => ({
  }),
  computed: {
  },
  async mounted() {
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