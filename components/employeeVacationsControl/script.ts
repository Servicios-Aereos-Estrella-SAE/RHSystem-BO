import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'

export default defineComponent({
  components: {
  },
  name: 'employeeVacationsControl',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    isReady: false as boolean,
    date: DateTime.now().setLocale('en').setZone(DateTime.now().zoneName).toJSDate(),
    dateF: DateTime.now().setLocale('en').setZone(DateTime.now().zoneName).toFormat('DDDD'),
    displayForm: false as boolean
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.isReady = true
  },
  methods: {
  }
})