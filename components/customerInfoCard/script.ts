import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { CustomerInterface } from '~/resources/scripts/interfaces/CustomerInterface'

export default defineComponent({
  name: 'CustomerInfoCard',
  props: {
    customer: { type: Object as PropType<CustomerInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }
  },
  data: () => ({
  }),
  computed: {
  },
  async mounted() {
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
  }
})