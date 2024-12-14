import { ShiftExceptionsErrorScript } from '#build/components';
import { defineComponent } from 'vue'
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface';

export default defineComponent({
  name: 'shiftExceptionsError',
  props: {
    shiftExceptions: { type: Array<ShiftExceptionErrorInterface> }
  },
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
    handlerConfirm () {
      
      this.$emit('confirm')
    },
    handlerCancel () {
      this.$emit('cancel')
    }
  }
});
