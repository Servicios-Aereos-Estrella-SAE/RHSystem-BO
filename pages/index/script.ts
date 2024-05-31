import { defineComponent } from 'vue'

export default defineComponent({
  props: {
  },
  data: () => ({
    title: 'Hola'
  }),
  mounted() {
  },
  methods: {
    handlerLogin () {
      this.$router.push({ path: "/dashboard" })
    }
  }
})