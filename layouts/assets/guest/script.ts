import { defineComponent } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'guest',
  props: {
  },
  data: () => ({
  }),
  computed: {
    getBackgroundImageBanner(){
      const myGeneralStore = useMyGeneralStore()
      const backgroundImageBanner = myGeneralStore.backgroundImageBannner
      return backgroundImageBanner
    },
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