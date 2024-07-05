import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'

import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'

export default defineComponent({
  name: 'attendanceInfoCard',
  props: {
    department: { type: Object as PropType<DepartmentInterface>, required: false },
    position: { type: Object as PropType<PositionInterface>, required: false },
    onTimePercentage: { type: Number, required: false, default: 0 },
    onToleracePercentage: { type: Number, required: false, default: 0 },
    onDelayPercentage: { type: Number, required: false, default: 0 },
    onFaultPercentage: { type: Number, required: false, default: 0 },
    hideLink: { type: Boolean, required: false, default: false },
    hidePositionTitle: { type: Boolean, required: false, default: false }
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