import { defineComponent } from 'vue'

export default defineComponent({
  name: 'confirmRefuse',
  props: {
    actionType: {
        type: String,
        required: true, 
        validator: value => ['refuse', 'accept'].includes(value) 
      }
  },
  data: () => ({
    securityWord: 'confirm',
    verifyWord: '',
    isIncorrect: false
  }),
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handlerConfirmRefused() {
      if (this.securityWord.toLocaleLowerCase() !== this.verifyWord.toLocaleLowerCase()) {
        this.isIncorrect = true
        return
      }
      this.$emit(this.actionType === 'refuse' ? 'confirmRefuse' : 'confirmAccept');
    },
    handlerConfirmAction() {
        if (this.securityWord.toLocaleLowerCase() !== this.verifyWord.toLocaleLowerCase()) {
          this.isIncorrect = true;
          return;
        }
        this.$emit(this.actionType === 'refuse' ? 'confirmRefuse' : 'confirmAccept');
      },
    handlerCancel() {
      this.$emit('cancelRefused')
    }
  }
});
