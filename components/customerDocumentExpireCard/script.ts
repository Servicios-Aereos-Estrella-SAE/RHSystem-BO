export default defineComponent({
  name: 'customerDocumentExpireCard',
  props: {
    document: { type: Object as PropType<object[]> as any, required: true },
    clickOnCard: { type: Function, default: null },
  },
  data: () => ({
    percentage: 0,
    isMenuOpen: false,
  }),
  computed: {
    getName() {
      const person = this.document.customerProceedingFile?.customer?.person
      return person ? `${person.personFirstname} ${person.personLastname} ${person.personSecondLastname}` : ''
    },
    isExpired() {
      const expirationDate = new Date(this.document.proceedingFileExpirationAt);
      const currentDate = new Date();
      return expirationDate < currentDate;
    },
  },
  async mounted() {
  },
  methods: {
    toggleMenu(isOpen: boolean) {
      this.isMenuOpen = isOpen;
    },
    openFile() {
      window.open(this.document.proceedingFilePath)
    }
  },
})