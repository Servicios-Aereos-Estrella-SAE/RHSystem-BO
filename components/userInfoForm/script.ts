import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'

export default defineComponent({
  name: 'userInfoForm',
  props: {
    user: { type: Object as PropType<UserInterface>, required: true }
  },
  data: () => ({
    activeSwicht: true,
  }),
  computed: {
  },
  mounted() {
    let isActive: any = 1
    isActive = this.user.userActive
    if (isActive === 1) {
      isActive = true
    }
    this.activeSwicht = isActive
  },
  methods: {
  }
})