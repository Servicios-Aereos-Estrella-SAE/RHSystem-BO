import { DateTime } from "luxon";

export default defineComponent({
  name: 'employeeDocumentExpireCard',
  props: {
    document: { type: Object as PropType<object> as any, required: true },
    clickOnCard: { type: Function, default: null },
  },
  data: () => ({
    percentage: 0,
    isMenuOpen: false,
  }),
  computed: {
    getName() {
      const person =
        this.document.employeeProceedingFile?.employee?.person ||
        this.document.person;

      if (!person) return '';

      const { personFirstname = '', personLastname = '', personSecondLastname = '' } = person;
      return `${personFirstname} ${personLastname} ${personSecondLastname}`.trim();
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
    },
    expireDateFormat(date: string) {
      const toDate = DateTime.fromISO(date, { setZone: true }).setZone('UTC-6').setLocale('en')
      return toDate.toFormat('LLLL dd, yyyy')
    }
  },
})
