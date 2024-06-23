import { defineComponent } from 'vue'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'dashboardHeader',
  props: {
  },
  data: () => ({
  }),
  computed: {
    displayBackButton () {
      const path = this.$route.fullPath
      const isRoot = path.split('/').length > 2
      return isRoot
    }
  },
  mounted() {
  },
  methods: {
    async toggleAside () {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.toggleDisplayAside()
    },
    handlerBack () {
      this.$router.go(-1)
    }
  }
})