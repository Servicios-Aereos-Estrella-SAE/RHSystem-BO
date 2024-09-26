import { defineComponent } from 'vue'
import UserService from '~/resources/scripts/services/UserService';
import { useMyGeneralStore } from '~/store/general';

export default defineComponent({
  name: "NuevaContrasena",
  props: {
  },
  data: () => ({
    validToken: true as boolean,
    otpCode: '' as string,
    newPassword: '' as string,
    newPasswordConfirmed: '' as string,
    token: ''
  }),
  computed: {
    statusFullLoader() {
      const myGeneralStore = useMyGeneralStore()
      const status = myGeneralStore.fullLoader
      return status
    }
  },
  async mounted() {
    this.validToken = false
    const route = useRoute()
    this.token = route.params.token ? route.params.token.toString() : '';
    if (!this.token) {
      this.$toast.add({
        severity: 'warn',
        summary: 'User',
        detail: 'User token not found',
        life: 5000,
      })
      return
    }
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    const userService = new UserService()
    const userResponse = await userService.verifyToken(this.token)
    if (userResponse.status !== 200) {
      this.$toast.add({
        severity: 'warn',
        summary: 'User',
        detail: userResponse._data.message,
        life: 5000,
      })
    } else {
      this.validToken = true
    }
    myGeneralStore.setFullLoader(false)
  },
  methods: {
    async handlerNewPasswordRequest() {
      const userService = new UserService()
      if (!this.newPassword) {
        this.$toast.add({
          severity: 'warn',
          summary: 'User',
          detail: 'Password is required',
          life: 5000,
        })
        return
      }
      if (!userService.isValidPassword(this.newPassword)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'User',
          detail: 'The password entered does not meet the requested characteristics',
          life: 5000,
        })
        return
      }

      if (this.newPassword !== this.newPasswordConfirmed) {
        this.$toast.add({
          severity: 'warn',
          summary: 'User',
          detail: 'passwords do not match',
          life: 5000,
        })
        return
      }
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const userResponse = await userService.passwordReset(this.token, this.newPassword)
      if (userResponse.status == 200) {
        this.$toast.add({
          severity: 'success',
          summary: 'User',
          detail: userResponse._data.message,
          life: 5000,
        })
        this.$router.push({ path: "/" })
      } else {
        this.$toast.add({
          severity: 'warn',
          summary: 'User',
          detail: userResponse._data.message,
          life: 5000,
        })
      }
      myGeneralStore.setFullLoader(false)
    },
    async generatePassword() {
      const userService = new UserService()
      const password = userService.generatePassword()
      this.newPassword = password
      this.newPasswordConfirmed = password
    }
  }
})