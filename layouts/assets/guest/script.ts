import { defineComponent } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'

export default defineComponent({
  name: 'guest',
  props: {
  },
  data: () => ({
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
  }
})