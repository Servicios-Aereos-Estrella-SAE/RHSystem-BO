import { DateTime } from 'luxon'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
  },
  name: 'vacationsControl',
  props: {
  },
  data: () => ({
    date: DateTime.now().setLocale('en').setZone(DateTime.now().zoneName).toJSDate(),
    dateF: DateTime.now().setLocale('en').setZone(DateTime.now().zoneName).toFormat('DDDD'),
    displayForm: false as boolean
  }),
  computed: {
  },
  async mounted() {
  },
  methods: {
  }
})