import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { FlightAttendantInterface } from '~/resources/scripts/interfaces/FlightAttendantInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import type { FlightAttendantProceedingFileInterface } from '~/resources/scripts/interfaces/FlightAttendantProceedingFileInterface';
import type { ProceedingFileInterface } from '~/resources/scripts/interfaces/ProceedingFileInterface';
import FlightAttendantProceedingFileService from '~/resources/scripts/services/FlightAttendantProceedingFileService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'flightAttendantProceedingFile',
  props: {
    flightAttendant: { type: Object as PropType<FlightAttendantInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    flightAttendantProceedingFilesList: [] as FlightAttendantProceedingFileInterface[],
    proceedingFilesList: [] as ProceedingFileInterface[],
    selectedProceedingFileId: null as number | null,
    flightAttendantProceedingFile: null as FlightAttendantProceedingFileInterface | null,
    flightAttendantProceedingFileActiveId: 0 as number | null,
    drawerFlightAttendantProceedingFileForm: false,
    drawerFlightAttendantProceedingFileDelete: false,
    selectedDateTimeDeleted: '' as string | null
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getFlightAttendantProceedingFiles()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
   
  },
  methods: {
    async getFlightAttendantProceedingFiles() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.flightAttendantProceedingFilesList = []
      const flightAttendantId = this.flightAttendant.flightAttendantId ? this.flightAttendant.flightAttendantId : 0
      const flightAttendantProceedingFileService = new FlightAttendantProceedingFileService()
      const flightAttendantProceedingFileResponse = await flightAttendantProceedingFileService.getByFlightAttendant(flightAttendantId)
      this.flightAttendantProceedingFilesList = flightAttendantProceedingFileResponse.proceedingFiles
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newFlightAttendantProceedingFile: FlightAttendantProceedingFileInterface = {
        flightAttendantProceedingFileId: null,
        flightAttendantId: this.flightAttendant.flightAttendantId,
        proceedingFileId: null,
        flightAttendantProceedingFileCreatedAt: null,
        flightAttendantProceedingFileUpdatedAt: null,
        flightAttendantProceedingFileDeletedAt: null
      }
      this.flightAttendantProceedingFile = newFlightAttendantProceedingFile
      this.drawerFlightAttendantProceedingFileForm = true
    },
    async onSave(flightAttendantProceedingFile: FlightAttendantProceedingFileInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.flightAttendantProceedingFile = {...flightAttendantProceedingFile}
      
      const index = this.flightAttendantProceedingFilesList.findIndex((flightAttendantProceedingFile: FlightAttendantProceedingFileInterface) => flightAttendantProceedingFile.flightAttendantProceedingFileId === this.flightAttendantProceedingFile?.flightAttendantProceedingFileId)
      if (index !== -1) {
        this.flightAttendantProceedingFilesList[index] = flightAttendantProceedingFile
        this.$forceUpdate()
      } else {
        this.flightAttendantProceedingFilesList.push(flightAttendantProceedingFile)
        this.$forceUpdate()
      }
      this.drawerFlightAttendantProceedingFileForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(flightAttendantProceedingFile: FlightAttendantProceedingFileInterface) {
      this.flightAttendantProceedingFile = {...flightAttendantProceedingFile}
      this.drawerFlightAttendantProceedingFileForm = true
    },
    onDelete(flightAttendantProceedingFile: FlightAttendantProceedingFileInterface) {
      this.flightAttendantProceedingFile = {...flightAttendantProceedingFile}
      this.selectedDateTimeDeleted = ''
      this.drawerFlightAttendantProceedingFileDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.flightAttendantProceedingFile) {
        this.drawerFlightAttendantProceedingFileDelete = false
        const flightAttendantProceedingFileService = new FlightAttendantProceedingFileService()
        const flightAttendantProceedingFileResponse = await flightAttendantProceedingFileService.delete(this.flightAttendantProceedingFile)
        if (flightAttendantProceedingFileResponse.status === 200) {
          const index = this.flightAttendantProceedingFilesList.findIndex((flightAttendantProceedingFile: FlightAttendantProceedingFileInterface) => flightAttendantProceedingFile.flightAttendantProceedingFileId === this.flightAttendantProceedingFile?.flightAttendantProceedingFileId)
          if (index !== -1) {
            this.flightAttendantProceedingFilesList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete proceeding file flight attendant',
            detail: flightAttendantProceedingFileResponse._data.message,
              life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete proceeding file flight attendant',
            detail: flightAttendantProceedingFileResponse._data.message,
              life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})