import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'

export default defineComponent({
  name: 'employeeInfoCard',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    clickOnPhoto: { type: Function, default: null }
  },
  data: () => ({
    dateFirstYear: '',
    canHaveVacations: false
  }),
  computed: {
  },
  mounted() {
    if (this.employee.employeeHireDate) {
      const now = DateTime.now()
      const hasCompletedYear = now.diff(DateTime.fromISO(this.employee.employeeHireDate.toString()), 'years').years >= 1
      const dateFirstYear = DateTime.fromISO(this.employee.employeeHireDate.toString()).plus({ years: 1 })
      this.dateFirstYear = dateFirstYear.toFormat('DD')
      if (hasCompletedYear) {
        this.canHaveVacations = true
      /*   console.log('ya cumplio el año')
        console.log('el primer año lo cumplio el ' + dateFirstYear.toFormat('yyyy-MM-dd')) */
     /*  } else {
        console.log('aún no cumple el año')
        console.log('el primer año lo cumplirá el ' + dateFirstYear.toFormat('yyyy-MM-dd'))
      } */
      }
    }
  },
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
  }
})