import { defineComponent } from 'vue'

export default defineComponent({
  name: 'dashboardHeader',
  props: {
  },
  data: () => ({
    displayAside: true as boolean,
    asideVisibilityStatus: null as any
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
      this.displayAside = !this.displayAside
      this.$emit('onAsideVisibilityChange', this.displayAside)
    },
    handlerBack () {
      this.$router.go(-1)
    }
  }
})