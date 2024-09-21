import { DateTime } from "luxon"
import EmployeeProceedingFileService from "~/resources/scripts/services/EmployeeProceedingFileService"
import { useMyGeneralStore } from "~/store/general"

export default defineComponent({
  name: 'employeeDocumentCard',
  props: {
    clickOnCard: { type: Function, default: null },
  },
  data: () => ({
    proceedingFilesExpiredCount: 0,
    proceedingFilesExpiringCount: 0,
  }),
  computed: {
    getPercentage () {
      let total = this.proceedingFilesExpiredCount + this.proceedingFilesExpiringCount
      const percentage = (this.proceedingFilesExpiringCount / total) * 100
      return total > 0 ?  Math.ceil(percentage) : 0
    },
    classCard() {
      return (this.proceedingFilesExpiringCount === 0 && this.proceedingFilesExpiredCount === 0) ? '' :
          this.proceedingFilesExpiredCount >= this.proceedingFilesExpiringCount ? 'expired' : 'next-expire'
    }
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    const employeeProceedingFileService = new EmployeeProceedingFileService()
    const dateNow = DateTime.now().toFormat('yyyy-LL-dd')
    const employeeProceedingFileResponse = await employeeProceedingFileService.getExpiresAndExpiring('2024-01-01', dateNow)
    if (employeeProceedingFileResponse.status === 200) {
       this.proceedingFilesExpiredCount = employeeProceedingFileResponse._data.data.employeeProceedingFiles.proceedingFilesExpired.length
       this.proceedingFilesExpiringCount = employeeProceedingFileResponse._data.data.employeeProceedingFiles.proceedingFilesExpiring.length
      
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Employee proceeding files',
        detail: employeeProceedingFileResponse._data.message,
        life: 5000,
    });
    }
    myGeneralStore.setFullLoader(false)
  },
  methods: {
    handlerClickOnCard () {
      if (this.clickOnCard) {
        this.clickOnCard()
      }
    },
  },
})