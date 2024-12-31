import { defineComponent } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

export default defineComponent({
  props: {
    hasStops: { type: Boolean, required: false, default: false },
  },
  components: {
    Toast,
    ToastService,
  },
  name: 'aircraftSelectedInfoCard',
})