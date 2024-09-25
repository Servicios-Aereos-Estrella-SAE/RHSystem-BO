import { defineComponent } from 'vue'
import UserService from '~/resources/scripts/services/UserService'

export default defineComponent({
  name: "RecuperarContrasena",
  props: {
  },
  data: () => ({
    userEmail: ''
  }),
  mounted() {
  },
  methods: {
    async handlerPasswordRequest () {
      if (!this.userEmail) {
        this.$toast.add({
          severity: 'warn',
          summary: 'User email',
          detail: 'User email is required',
          life: 5000,
      });
      return
      }
      const userService = new UserService()
      const userResponse = await userService.recovery(this.userEmail)
      if (userResponse.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: 'User',
          detail: userResponse._data.message,
          life: 5000,
        });
        this.$router.push({ path: "/nueva-contrasena" })
      } else {
        this.$toast.add({
          severity: 'warn',
          summary: 'User',
          detail: userResponse._data.message,
          life: 5000,
      });
      }
    }
  }
})