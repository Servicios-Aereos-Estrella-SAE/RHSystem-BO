import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'

export default defineComponent({
  name: 'userInfoCard',
  props: {
    user: { type: Object as PropType<UserInterface>, required: true }
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