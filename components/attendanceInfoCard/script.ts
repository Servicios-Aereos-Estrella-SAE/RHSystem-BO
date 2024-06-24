import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'

import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'

export default defineComponent({
  name: 'attendanceInfoCard',
  props: {
    department: { type: Object as PropType<DepartmentInterface>, required: true },
    position: { type: Object as PropType<PositionInterface>, required: true }
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