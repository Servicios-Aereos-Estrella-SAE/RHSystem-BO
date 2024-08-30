import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import type { EmployeeAssistStatisticInterface } from '~/resources/scripts/interfaces/EmployeeAssistStatisticInterface'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import AssistService from '~/resources/scripts/services/AssistService'

export default defineComponent({
  name: 'attendanceEmployeeInfoCard',
  props: {
    employee: { type: Object as PropType<EmployeeAssistStatisticInterface> | null | undefined, required: false }
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