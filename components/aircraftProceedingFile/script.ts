import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import type { AircraftProceedingFileInterface } from '~/resources/scripts/interfaces/AircraftProceedingFileInterface';
import type { ProceedingFileInterface } from '~/resources/scripts/interfaces/ProceedingFileInterface';
import AircraftProceedingFileService from '~/resources/scripts/services/AircraftProceedingFileService';


export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'aircraftProceedingFile',
  props: {
    aircraft: { type: Object as PropType<AircraftInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    aircraftProceedingFilesList: [] as AircraftProceedingFileInterface[],
    proceedingFilesList: [] as ProceedingFileInterface[],
    selectedProceedingFileId: null as number | null,
    aircraftProceedingFile: null as AircraftProceedingFileInterface | null,
    aircraftProceedingFileActiveId: 0 as number | null,
    drawerAircraftProceedingFileForm: false,
    drawerAircraftProceedingFileDelete: false,
    selectedDateTimeDeleted: '' as string | null
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getAircraftProceedingFiles()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    async getAircraftProceedingFiles() {
      console.log("getAoircraft Proceddin filles")
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.aircraftProceedingFilesList = []
      const aircraftId = this.aircraft.aircraftId ? this.aircraft.aircraftId : 0
      const aircraftProceedingFileService = new AircraftProceedingFileService()
      const aircraftProceedingFileResponse = await aircraftProceedingFileService.getByAircraft(aircraftId)
      this.aircraftProceedingFilesList = aircraftProceedingFileResponse.data.data
      console.log(this.aircraftProceedingFilesList)
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newAircraftProceedingFile: AircraftProceedingFileInterface = {
        aircraftProceedingFileId: null,
        aircraftId: this.aircraft.aircraftId,
        proceedingFileId: null,
        aircraftProceedingFileCreatedAt: null,
        aircraftProceedingFileUpdatedAt: null,
        aircraftProceedingFileDeletedAt: null
      }
      this.aircraftProceedingFile = newAircraftProceedingFile
      this.drawerAircraftProceedingFileForm = true
    },
    async onSave(aircraftProceedingFile: AircraftProceedingFileInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.aircraftProceedingFile = { ...aircraftProceedingFile }
      
      const index = this.aircraftProceedingFilesList.findIndex((aircraftProceedingFile: AircraftProceedingFileInterface) => aircraftProceedingFile.aircraftProceedingFileId === this.aircraftProceedingFile?.aircraftProceedingFileId)
      if (index !== -1) {
        this.aircraftProceedingFilesList[index] = aircraftProceedingFile
        this.$forceUpdate()
      } else {
        this.aircraftProceedingFilesList.push(aircraftProceedingFile)
        this.$forceUpdate()
      }
      this.drawerAircraftProceedingFileForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(aircraftProceedingFile: AircraftProceedingFileInterface) {
      this.aircraftProceedingFile = { ...aircraftProceedingFile }
      this.drawerAircraftProceedingFileForm = true
    },
    onDelete(aircraftProceedingFile: AircraftProceedingFileInterface) {
      this.aircraftProceedingFile = { ...aircraftProceedingFile }
      this.selectedDateTimeDeleted = ''
      this.drawerAircraftProceedingFileDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.aircraftProceedingFile) {
        this.drawerAircraftProceedingFileDelete = false
        const aircraftProceedingFileService = new AircraftProceedingFileService()
        const aircraftProceedingFileResponse = await aircraftProceedingFileService.delete(this.aircraftProceedingFile)
        if (aircraftProceedingFileResponse.status === 200) {
          const index = this.aircraftProceedingFilesList.findIndex((aircraftProceedingFile: AircraftProceedingFileInterface) => aircraftProceedingFile.aircraftProceedingFileId === this.aircraftProceedingFile?.aircraftProceedingFileId)
          if (index !== -1) {
            this.aircraftProceedingFilesList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete proceeding file aircraft',
            detail: aircraftProceedingFileResponse._data.message,
            life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete proceeding file aircraft',
            detail: aircraftProceedingFileResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})
