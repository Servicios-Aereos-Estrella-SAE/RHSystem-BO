export default defineComponent({
  name: 'aircraftDocumentCard',
  props: {
    aircraft: { type: Object as PropType<object> as any, required: true },
    clickOnCard: { type: Function, default: null },
  },
  data: () => ({
  }),
  computed: {
    classCard() {
      /* return (this.aircraft.upcomingExpiredDocumentsCount === 0 && this.aircraft.expiredDocumentsCount === 0) ? '' :
          this.aircraft.expiredDocumentsCount >= this.aircraft.upcomingExpiredDocumentsCount ? 'expired' : 'next-expire' */
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