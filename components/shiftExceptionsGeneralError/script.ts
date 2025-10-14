import { defineComponent } from 'vue'
import type { ShiftExceptionGeneralErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionGeneralErrorInterface';

export default defineComponent({
  name: 'shiftExceptionsGeneralError',
  props: {
    shiftExceptions: { type: Array<ShiftExceptionGeneralErrorInterface> }
  },
  data: () => ({
    securityWord: 'confirm',
    verifyWord: '',
    isIncorrect: false
  }),
  computed: {},
  created() { },
  mounted() {
  },
  methods: {
    handlerConfirm() {

      this.$emit('confirm')
    },
    handlerCancel() {
      this.$emit('cancel')
    }
  }
});
