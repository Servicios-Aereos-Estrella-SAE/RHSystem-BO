import { defineComponent } from 'vue'

export default defineComponent({
  name: 'confirmReactivate',
  props: {},
  data: () => ({
    securityWord: 'confirm',
    verifyWord: '',
    isIncorrect: false
  }),
  computed: {},
  created () {},
  mounted() {
  },
  methods: {
    handlerConfirmReactivate () {
      if (this.securityWord.toLocaleLowerCase() !== this.verifyWord.toLocaleLowerCase()) {
        this.isIncorrect = true
        return
      }

      this.$emit('confirmReactivate')
    },
    handlerCancel () {
      this.$emit('cancelReactivate')
    }
  }
});
