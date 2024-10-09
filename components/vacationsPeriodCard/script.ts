import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'

export default defineComponent({
  components: {
  },
  name: 'vacationsPeriodCard',
  props: {
    hideManager: { type: Boolean, default: false }
  },
  data: () => ({
  }),
  computed: {
  },
  async mounted() {
  },
  methods: {
    handlerClickManage () {
      this.$emit('manageVacations')
    }
  }
})