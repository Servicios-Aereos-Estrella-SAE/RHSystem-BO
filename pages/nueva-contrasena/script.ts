import { defineComponent } from 'vue'

export default defineComponent({
  name: "NuevaContrasena",
  props: {
  },
  data: () => ({
    validToken: true as boolean,
    otpCode: '' as string,
    newPassword: '' as string,
    newPasswordConfirmed: '' as string
  }),
  mounted() {
  },
  methods: {
    handlerNewPasswordRequest () {
      this.$router.push({ path: "/" })
    }
  }
})