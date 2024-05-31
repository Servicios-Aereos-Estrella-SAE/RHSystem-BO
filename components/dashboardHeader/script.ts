import { defineComponent } from 'vue'

export default defineComponent({
  name: 'dashboardHeader',
  props: {
  },
  data: () => ({
    displayAside: true as boolean,
    asideVisibilityStatus: null as any
  }),
  mounted() {
  },
  methods: {
    async toggleAside () {
      this.displayAside = !this.displayAside
      this.$emit('onAsideVisibilityChange', this.displayAside)
    }
  }
})