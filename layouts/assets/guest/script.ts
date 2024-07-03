import { defineComponent } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'

export default defineComponent({
  name: 'guest',
  props: {
  },
  data: () => ({
    guest: true,
  }),
  computed: {
  },
  created() {
    // const colorMode = useColorMode()
  },
  async mounted() {
    // await this.verifyAuthStatus()
  },
  methods: {
    // setcolor () {
    //   definePageMeta({
    //     colorMode: this.$colorMode.preference,
    //   })
    // },
    async verifyAuthStatus () {
      /* const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      this.guest = !(!!authUser)

      if (!this.guest) {
        this.$router.push('/attendance-monitor')
      } */
    },
  }
})