import { defineComponent } from 'vue'

export default defineComponent({
  name: 'backoffice',
  props: {
  },
  data: () => ({
    asideVisibilityStatus: true
  }),
  created() {
    // const colorMode = useColorMode()
  },
  mounted() {
  },
  methods: {
    handlerAsideVisibilityChange (status: boolean) {
      this.asideVisibilityStatus = status
    },
    // setcolor () {
    //   definePageMeta({
    //     colorMode: this.$colorMode.preference,
    //   })
    // }
  }
})