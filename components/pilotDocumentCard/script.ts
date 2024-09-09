export default defineComponent({
  name: 'pilotDocumentCard',
  props: {
    pilot: { type: Object as PropType<object> as any, required: true },
    clickOnCard: { type: Function, default: null },
  },
  data: () => ({
  }),
  computed: {
    classCard() {
      return (this.pilot.upcomingExpiredDocumentsCount === 0 && this.pilot.expiredDocumentsCount === 0) ? '' :
          this.pilot.expiredDocumentsCount >= this.pilot.upcomingExpiredDocumentsCount ? 'expired' : 'next-expire'
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