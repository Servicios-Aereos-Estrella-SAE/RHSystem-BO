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
    isExpired() {
      const expirationDate = new Date(this.document.proceeding_file_expiration_at);
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