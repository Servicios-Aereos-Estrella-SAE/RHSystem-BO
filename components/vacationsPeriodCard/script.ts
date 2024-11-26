import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { VacationPeriodInterface } from '~/resources/scripts/interfaces/VacationPeriodInterface'

export default defineComponent({
  components: {
  },
  name: 'vacationsPeriodCard',
  props: {
    vacationPeriod: { type: Object as PropType<VacationPeriodInterface>, required: true },
    hideManager: { type: Boolean, default: false },
    canManageVacation: { type: Boolean, required: true }
  },
  data: () => ({
  }),
  computed: {
  },
  async mounted() {
  },
  methods: {
    handlerClickManage () {
      this.$emit('manageVacations', this.vacationPeriod as VacationPeriodInterface)
    }
  }
})