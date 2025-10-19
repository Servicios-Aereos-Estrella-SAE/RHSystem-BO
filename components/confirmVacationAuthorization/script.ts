import { defineComponent } from 'vue'

export default defineComponent({
  name: 'confirmVacationAuthorization',
  props: {},
  data: () => ({
    securityWord: 'authorize',
    verifyWord: '',
    isIncorrect: false
  }),
  computed: {},
  created () {},
  mounted() {
  },
  methods: {
    handlerConfirmAuthorization () {
      if (this.securityWord.toLocaleLowerCase() !== this.verifyWord.toLocaleLowerCase()) {
        this.isIncorrect = true
        return
      }

      this.$emit('confirm')
    },
    handlerCancel () {
      this.$emit('cancel')
    }
  }
});
