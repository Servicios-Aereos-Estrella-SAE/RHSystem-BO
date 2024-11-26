import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'

export default defineComponent({
  name: 'employeeInfoCard',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    clickOnPhoto: { type: Function, default: null },
    canManageShifts: { type: Boolean, default: false, required: true },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }
  },
  data: () => ({
  }),
  computed: {
  },
  mounted() {
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnShifts () {
      this.$emit('clickShifts', this.employee)
    },
    onClickPhoto() {
      this.clickOnPhoto()
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    handlerOpenProceedingFiles () {
      this.$emit('clickProceedingFiles', this.employee)
    }
  }
})