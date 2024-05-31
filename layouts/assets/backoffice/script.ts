import { defineComponent } from 'vue'

export default defineComponent({
  name: 'backoffice',
  props: {
  },
  data: () => ({
    asideVisibilityStatus: true
  }),
  mounted() {
  },
  methods: {
    handlerAsideVisibilityChange (status: boolean) {
      this.asideVisibilityStatus = status
    }
  }
})