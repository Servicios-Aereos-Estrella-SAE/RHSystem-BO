import { DateTime } from "luxon"
import EmployeeProceedingFileService from "~/resources/scripts/services/EmployeeProceedingFileService"
import { useMyGeneralStore } from "~/store/general"

export default defineComponent({
  name: 'employeeDocumentCard',
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  props: {
    clickOnCard: { type: Function, default: null },
  },
  data: () => ({
    proceedingFilesExpiredCount: 0,
    proceedingFilesExpiringCount: 0,
    allFilesCount: 0
  }),
  computed: {
    getPercentage() {
      const total = this.allFilesCount
      const expired = this.proceedingFilesExpiredCount
      const available = total - expired

      const percentage = (available / total) * 100
      return total > 0 ? Math.floor(percentage) : 0
    },
    availableCount() {
      const total = this.allFilesCount
      const expired = this.proceedingFilesExpiredCount
      const toExpire = this.proceedingFilesExpiringCount
      const available = total - expired - toExpire
      return available
    },
    classCard() {
      if (this.getPercentage >= 100) {
        return ''
      }

      if (this.getPercentage > 50) {
        return 'next-expire'
      }

      return 'expired'
    }
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    const employeeProceedingFileService = new EmployeeProceedingFileService()
    const dateNow = DateTime.now().toFormat('yyyy-LL-dd')
    const employeeProceedingFileResponse = await employeeProceedingFileService.getExpiresAndExpiring('2000-01-01', dateNow)
    if (employeeProceedingFileResponse.status === 200) {
      this.proceedingFilesExpiredCount = employeeProceedingFileResponse._data.data.employeeProceedingFiles.proceedingFilesExpired.length
      this.proceedingFilesExpiringCount = employeeProceedingFileResponse._data.data.employeeProceedingFiles.proceedingFilesExpiring.length
      this.allFilesCount = employeeProceedingFileResponse._data.data.employeeProceedingFiles.quantityFiles

      this.proceedingFilesExpiredCount += employeeProceedingFileResponse._data.data.employeeProceedingFiles.contractsExpired.length
      this.proceedingFilesExpiringCount += employeeProceedingFileResponse._data.data.employeeProceedingFiles.contractsExpiring.length
      this.allFilesCount += employeeProceedingFileResponse._data.data.employeeProceedingFiles.quantityContracts
    } else {
      this.$toast.add({
        severity: 'error',
        summary: `${this.t('employee')} ${this.t('proceeding_files')}`,
        detail: employeeProceedingFileResponse._data.message,
        life: 5000,
      });
    }
    myGeneralStore.setFullLoader(false)
  },
  methods: {
    handlerClickOnCard() {
      if (this.clickOnCard) {
        this.clickOnCard()
      }
    },
  },
})
