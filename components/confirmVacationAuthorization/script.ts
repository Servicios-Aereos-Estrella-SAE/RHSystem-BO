import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfirmVacationAuthorization',
  emits: ['confirm', 'cancel'],
  data: () => ({
    verifyWord: '',
    isIncorrect: false,
    securityWord: 'AUTORIZAR'
  }),
  methods: {
    handlerConfirmAuthorization() {
      if (this.verifyWord.toUpperCase() === this.securityWord) {
        this.isIncorrect = false
        this.$emit('confirm')
      } else {
        this.isIncorrect = true
        this.verifyWord = ''
      }
    },
    handlerCancel() {
      this.verifyWord = ''
      this.isIncorrect = false
      this.$emit('cancel')
    }
  }
})
