import { defineComponent } from 'vue'
import UserService from '~/resources/scripts/services/UserService';

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
  async mounted() {
    this.validToken = false
    const route = useRoute()
    const token = route.params.token ? route.params.token.toString() : null;
    if (!token) {
      this.$toast.add({
        severity: 'warn',
        summary: 'User',
        detail: 'User token not found',
        life: 5000,
    });
    return
    }
    const userService = new UserService()
    const userResponse = await userService.verifyToken(token)
    if (userResponse.status !== 200) {
      this.$toast.add({
        severity: 'warn',
        summary: 'User',
        detail: userResponse._data.message,
        life: 5000,
    });
    } else {
      this.validToken = true
    }
  },
  methods: {
    handlerNewPasswordRequest () {
      this.$router.push({ path: "/" })
    }
  }
})