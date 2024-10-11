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
import type { ProceedingFileTypeInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeInterface';
import ProceedingFileTypeService from '~/resources/scripts/services/ProceedingFileTypeService';
import ProceedingFile from '~/resources/scripts/models/ProceedingFile';


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
    selectedDateTimeDeleted: '' as string | null,
    proceedingFileTypesList: [] as ProceedingFileTypeInterface[],
    clicks: 0 as number,
    timer: null as any,
    delay: 250 as number,
    folderSelected: null as ProceedingFileTypeInterface | null,
    filesLoader: false as boolean
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getProceedingFileTypes()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    async getAircraftProceedingFiles() {
      if (!this.folderSelected) {
        return false
      }

      this.aircraftProceedingFilesList = []
      const aircraftId = this.aircraft.aircraftId ? this.aircraft.aircraftId : 0
      const aircraftProceedingFileService = new AircraftProceedingFileService()
      const aircraftProceedingFileResponse = await aircraftProceedingFileService.getByAircraft(aircraftId, this.folderSelected.proceedingFileTypeId as number)
      this.aircraftProceedingFilesList = aircraftProceedingFileResponse.data.data
    },
    addNew() {
      if (!this.folderSelected) {
        return
      }

      const fakeProceedingFile: ProceedingFileInterface = new ProceedingFile().toModelObject()
      fakeProceedingFile.proceedingFileTypeId = this.folderSelected.proceedingFileTypeId

      const newAircraftProceedingFile: AircraftProceedingFileInterface = {
        aircraftProceedingFileId: null,
        aircraftId: this.aircraft.aircraftId,
        proceedingFileId: null,
        aircraftProceedingFileCreatedAt: null,
        aircraftProceedingFileUpdatedAt: null,
        aircraftProceedingFileDeletedAt: null,
        proceedingFile: fakeProceedingFile
      }
      this.aircraftProceedingFile = newAircraftProceedingFile
      this.drawerAircraftProceedingFileForm = true
    },
    async onSave(aircraftProceedingFile: AircraftProceedingFileInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.aircraftProceedingFile = {...aircraftProceedingFile}
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
    async getProceedingFileTypes() {
      this.proceedingFileTypesList = []
      const proceedingFileTypeService = new ProceedingFileTypeService()
      const proceedingFileTypeResponse = await proceedingFileTypeService.getByArea('aircraft')
      this.proceedingFileTypesList = proceedingFileTypeResponse._data.data.proceedingFileTypes
    },
    async handlerDoubleClick (folder: ProceedingFileTypeInterface) {
      this.clicks++
      if (this.clicks === 1) {
        this.timer = setTimeout( () => {
          this.clicks = 0
        }, this.delay)
      } else {
        clearTimeout(this.timer)
        this.clicks = 0
        this.folderSelected = folder

        this.filesLoader = true
        await this.getAircraftProceedingFiles()
        this.filesLoader = false
      }
    },
    handlerUnselectFolder () {
      this.folderSelected = null
      this.aircraftProceedingFilesList = []
    }
  }
})
