export default defineComponent({
  name: 'customerDocumentCard',
  props: {
    customer: { type: Object as PropType<object> as any, required: true },
    clickOnCard: { type: Function, default: null },
  },
  data: () => ({
    percentage: 0,
  }),
  computed: {
    classCard() {
      return (this.customer.upcomingExpiredDocumentsCount === 0 && this.customer.expiredDocumentsCount === 0) ? '' :
          this.customer.expiredDocumentsCount >= this.customer.upcomingExpiredDocumentsCount ? 'expired' : 'next-expire'
    }
  },
  async mounted() {
  },
  methods: {
    handlerClickOnCard () {
      if (this.clickOnCard) {
        this.clickOnCard()
      }
    },
  },
})