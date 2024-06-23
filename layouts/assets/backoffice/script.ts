import { defineComponent } from 'vue'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'backoffice',
  props: {
  },
  data: () => ({
  }),
  computed: {
    asideVisibilityStatus () {
      const myGeneralStore = useMyGeneralStore()
      const status = myGeneralStore.displayAside
      return status
    }
  },
  created() {
    // const colorMode = useColorMode()
  },
  mounted() {
  },
  methods: {
    // setcolor () {
    //   definePageMeta({
    //     colorMode: this.$colorMode.preference,
    //   })
    // }
  }
})