import { defineComponent } from 'vue'
import type { ExceptionRequestErrorInterface } from '~/resources/scripts/interfaces/ExceptionRequestErrorInterface';

export default defineComponent({
  name: 'exceptionRequestsError',
  props: {
    exceptionRequests: { type: Array<ExceptionRequestErrorInterface> }
  },
  data: () => ({
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
