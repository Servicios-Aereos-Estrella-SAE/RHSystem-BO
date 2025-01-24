import { defineComponent } from 'vue'
import UserService from '~/resources/scripts/services/UserService'
import { useMyGeneralStore } from '~/store/general';

export default defineComponent({
  name: "RecuperarContrasena",
  props: {
  },
  data: () => ({
    userEmail: '',
    sendEmail: false,
    sendMessage: ''
  }),
  mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.getSystemSettings()
  },
  computed: {
    getBackgroundImageLogo(){
      const myGeneralStore = useMyGeneralStore()
      const backgroundImage = myGeneralStore.backgroundImage
      return backgroundImage
    },
    statusFullLoader() {
      const myGeneralStore = useMyGeneralStore()
      const status = myGeneralStore.fullLoader
      return status
    }
  },
  methods: {
    async handlerPasswordRequest() {
      this.sendEmail = false
      this.sendMessage = ''
      if (!this.userEmail) {
        this.$toast.add({
          severity: 'warn',
          summary: 'User email',
          detail: 'User email is required',
          life: 5000,
        });
        return
      }
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const userService = new UserService()
      const userResponse = await userService.recovery(this.userEmail)
      if (userResponse.status === 200) {
        this.sendEmail = true
        this.$toast.add({
          severity: 'success',
          summary: 'User',
          detail: userResponse._data.message,
          life: 5000,
        });
        this.sendMessage = userResponse._data.message
      } else {
        this.$toast.add({
          severity: 'warn',
          summary: 'User',
          detail: userResponse._data.message,
          life: 5000,
        });
      }
      myGeneralStore.setFullLoader(false)
    }
  }
})