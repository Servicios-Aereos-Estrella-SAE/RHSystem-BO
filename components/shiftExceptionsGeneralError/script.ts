import { defineComponent } from 'vue'
import type { ShiftExceptionGeneralErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionGeneralErrorInterface';

export default defineComponent({
  name: 'shiftExceptionsGeneralError',
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  props: {
    shiftExceptions: { type: Array<ShiftExceptionGeneralErrorInterface> },
    quantityShiftExceptionsSaved: { type: Number }
  },
  data: () => ({
    securityWord: 'confirm',
    verifyWord: '',
    isIncorrect: false,
    messageSuccess: ''
  }),
  computed: {},
  created() { },
  mounted() {
    this.messageSuccess = this.t('the_permission_was_added_to_quantity_employees_successfully', { quantity: this.quantityShiftExceptionsSaved })
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
