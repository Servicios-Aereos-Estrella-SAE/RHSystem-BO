import { DateTime } from "luxon";

export default defineComponent({
  name: 'employeeDocumentExpireCard',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    document: { type: Object as PropType<object> as any, required: true },
    clickOnCard: { type: Function, default: null },
  },
  data: () => ({
    percentage: 0,
    isMenuOpen: false,
    localeToUse: 'en',
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
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
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
      const toDate = DateTime.fromISO(date, { setZone: true }).setZone('UTC-6').setLocale(this.localeToUse)
      return toDate.toFormat('LLLL dd, yyyy')
    },
    capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
})
