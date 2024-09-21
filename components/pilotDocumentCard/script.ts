import { DateTime } from "luxon"
import PilotProceedingFileService from "~/resources/scripts/services/PilotProceedingFileService"
import { useMyGeneralStore } from "~/store/general"

export default defineComponent({
  name: 'pilotDocumentCard',
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
    const pilotProceedingFileService = new PilotProceedingFileService()
    const dateNow = DateTime.now().toFormat('yyyy-LL-dd')
    const pilotProceedingFileResponse = await pilotProceedingFileService.getExpiresAndExpiring('2024-01-01', dateNow)
    if (pilotProceedingFileResponse.status === 200) {
       this.proceedingFilesExpiredCount = pilotProceedingFileResponse._data.data.pilotProceedingFiles.proceedingFilesExpired.length
       this.proceedingFilesExpiringCount = pilotProceedingFileResponse._data.data.pilotProceedingFiles.proceedingFilesExpiring.length
      
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Pilot proceeding files',
        detail: pilotProceedingFileResponse._data.message,
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