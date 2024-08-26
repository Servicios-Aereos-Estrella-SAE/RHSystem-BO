export default defineComponent({
  name: 'employeeDocumentCard',
  props: {
    employee: { type: Object as PropType<object> as any, required: true },
    clickOnCard: { type: Function, default: null },
  },
  data: () => ({
    percentage: 0,
  }),
  computed: {
    classCard() {
      return (this.employee.upcomingExpiredDocumentsCount === 0 && this.employee.expiredDocumentsCount === 0) ? '' :
          this.employee.expiredDocumentsCount >= this.employee.upcomingExpiredDocumentsCount ? 'expired' : 'next-expire'
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