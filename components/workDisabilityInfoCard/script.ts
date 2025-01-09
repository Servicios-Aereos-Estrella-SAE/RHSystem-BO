import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { WorkDisabilityInterface } from '~/resources/scripts/interfaces/WorkDisabilityInterface'

export default defineComponent({
  name: 'workDisabilityInfoCard',
  props: {
    workDisability: { type: Object as PropType<WorkDisabilityInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },

    clickOnEditException: { type: Function, default: null },
    clickOnDeleteException: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
    canManageException: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false, 
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
    handlerClickOnEditException () {
      if (this.clickOnEditException) {
        this.clickOnEditException()
      }
    },
    handlerClickOnDeleteException () {
      if (this.clickOnDeleteException) {
        this.clickOnDeleteException()
      }
    }
  }
})