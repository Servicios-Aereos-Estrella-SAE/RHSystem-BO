import { defineComponent } from 'vue'
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
    const myGeneralStore = useMyGeneralStore()
    const businessName = ref(myGeneralStore.activeSystemBusinessName)
    const businessFavicon = ref(myGeneralStore.favicon)

    useHead({
        titleTemplate: `${ businessName.value } BO | %s`,
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