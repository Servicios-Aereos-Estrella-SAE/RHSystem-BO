import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeAssistStatisticInterface } from '~/resources/scripts/interfaces/EmployeeAssistStatisticInterface'

export default defineComponent({
  name: 'attendanceEmployeeInfoCard',
  props: {
    employee: { type: Object as PropType<EmployeeAssistStatisticInterface> | null | undefined, required: false },
  },
  data: () => ({
  }),
  computed: {
  },
  mounted() {
  },
  methods: {
  }
})