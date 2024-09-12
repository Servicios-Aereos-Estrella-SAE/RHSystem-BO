import { DateTime } from "luxon"
import CustomerProceedingFileService from "~/resources/scripts/services/CustomerProceedingFileService"
import { useMyGeneralStore } from "~/store/general"

export default defineComponent({
  name: 'customerDocumentCard',
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
    const customerProceedingFileService = new CustomerProceedingFileService()
    const dateNow = DateTime.now().toFormat('yyyy-LL-dd')
    const customerProceedingFileResponse = await customerProceedingFileService.getExpiresAndExpiring('2024-01-01', dateNow)
    if (customerProceedingFileResponse.status === 200) {
       this.proceedingFilesExpiredCount = customerProceedingFileResponse._data.data.customerProceedingFiles.proceedingFilesExpired.length
       this.proceedingFilesExpiringCount = customerProceedingFileResponse._data.data.customerProceedingFiles.proceedingFilesExpiring.length
      
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Customer proceeding files',
        detail: customerProceedingFileResponse._data.message,
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