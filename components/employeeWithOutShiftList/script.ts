import { defineComponent } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'

export default defineComponent({
  components: {
  },
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  name: 'employeeWithOutShiftList',
  props: {
    employeesWithOutShift: { type: Array<EmployeeInterface>, required: true },
  },
  data: () => ({
    isReady: false
  }),
  computed: {
  },
  async mounted() {
    this.isReady = true
  },
  methods: {
  }
})
