import { defineComponent } from 'vue'

export default defineComponent({
  name: "Login",
  props: {
  },
  data: () => ({
  }),
  mounted() {
  },
  methods: {
    handlerLogin () {
      this.$router.push({ path: "/reporte-de-asistencia" })
    }
  }
})