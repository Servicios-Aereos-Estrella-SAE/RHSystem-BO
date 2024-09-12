import { DateTime } from "luxon"
import FlightAttendantProceedingFileService from "~/resources/scripts/services/FlightAttendantProceedingFileService"
import { useMyGeneralStore } from "~/store/general"

export default defineComponent({
  name: 'flightAttendantDocumentCard',
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
    const flightAttendantProceedingFileService = new FlightAttendantProceedingFileService()
    const dateNow = DateTime.now().toFormat('yyyy-LL-dd')
    const flightAttendantProceedingFileResponse = await flightAttendantProceedingFileService.getExpiresAndExpiring('2024-01-01', dateNow)
    if (flightAttendantProceedingFileResponse.status === 200) {
       this.proceedingFilesExpiredCount = flightAttendantProceedingFileResponse._data.data.flightAttendantProceedingFiles.proceedingFilesExpired.length
       this.proceedingFilesExpiringCount = flightAttendantProceedingFileResponse._data.data.flightAttendantProceedingFiles.proceedingFilesExpiring.length
      
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Flight attendant proceeding files',
        detail: flightAttendantProceedingFileResponse._data.message,
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