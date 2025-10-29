import { defineComponent } from 'vue'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'guest',
  props: {
  },
  data: () => ({
  }),
  computed: {
    getBackgroundImageBanner() {
      const myGeneralStore = useMyGeneralStore()
      const backgroundImageBanner = myGeneralStore.backgroundImageBannner
      return backgroundImageBanner
    },
    getPrimaryColor() {
      const myGeneralStore = useMyGeneralStore()
      const color = myGeneralStore.backgroundColor
      return color
    },
  },
  async created() {
    const myGeneralStore = useMyGeneralStore()
    await myGeneralStore.getSystemSettings()

    const businessName = ref(myGeneralStore.activeSystemBusinessName)
    const businessFavicon = ref(myGeneralStore.favicon)

    useHead({
      titleTemplate: `${businessName.value} RH | %s`,
      link: [
        { rel: 'icon', type: 'image/x-icon', href: businessFavicon.value }
      ]
    })

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
