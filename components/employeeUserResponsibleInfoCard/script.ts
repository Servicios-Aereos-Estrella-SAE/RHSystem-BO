import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { UserResponsibleEmployeeInterface } from '~/resources/scripts/interfaces/UserResponsibleEmployeeInterface'

export default defineComponent({
  name: 'employeeUserResponsibleInfoCard',
  props: {
    userResponsibleEmployee: { type: Object as PropType<UserResponsibleEmployeeInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false,
    canManageCurrentPeriod: false
  }),
  computed: {
  },
  async mounted() {
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
  }
})