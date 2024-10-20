import { DateTime } from "luxon"
import AircraftProceedingFileService from "~/resources/scripts/services/AircraftProceedingFileService"
import { useMyGeneralStore } from "~/store/general"

export default defineComponent({
  name: 'aircraftDocumentCard',
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
      const safePercentage = total > 0 ?  Math.ceil(percentage) : 0
      const value = 100 - safePercentage
      return value
    },
    classCard() {
      const percentage =  this.getPercentage
      let className = 'active'

      if (percentage > 0) {
        className = 'next-expire'
      }

      if (percentage >= 75) {
        className = 'expired'
      }

      return className
    }
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    const aircraftProceedingFileService = new AircraftProceedingFileService()
    const dateNow = DateTime.now().toFormat('yyyy-LL-dd')
    const aircraftProceedingFileResponse = await aircraftProceedingFileService.getExpiresAndExpiring('2024-01-01', dateNow)
    if (aircraftProceedingFileResponse.status === 200) {
       this.proceedingFilesExpiredCount = aircraftProceedingFileResponse._data.data.aircraftProceedingFiles.proceedingFilesExpired.length
       this.proceedingFilesExpiringCount = aircraftProceedingFileResponse._data.data.aircraftProceedingFiles.proceedingFilesExpiring.length
      
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Aircraft proceeding files',
        detail: aircraftProceedingFileResponse._data.message,
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