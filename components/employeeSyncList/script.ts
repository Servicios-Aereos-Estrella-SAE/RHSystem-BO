import { defineComponent } from 'vue'
import type { EmployeeSyncInterface } from '~/resources/scripts/interfaces/EmployeeSyncInterface'

export default defineComponent({
  components: {
  },
  name: 'employeeSyncListList',
  props: {
    employeesSync: { type: Array<EmployeeSyncInterface>, required: true },
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
