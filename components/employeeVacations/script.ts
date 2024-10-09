import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'

export default defineComponent({
  components: {
  },
  name: 'employeeVacations',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    isReady: false as boolean
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.isReady = true
  },
  methods: {
    handlerClickManage () {
      this.$emit('manageVacations')
    }
  }
})