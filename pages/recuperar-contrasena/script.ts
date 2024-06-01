import { defineComponent } from 'vue'

export default defineComponent({
  name: "RecuperarContrasena",
  props: {
  },
  data: () => ({
    title: 'Hola'
  }),
  mounted() {
  },
  methods: {
    handlerPasswordRequest () {
      this.$router.push({ path: "/nueva-contrasena" })
    }
  }
})