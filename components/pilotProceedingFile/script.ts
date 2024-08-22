import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { PilotInterface } from '~/resources/scripts/interfaces/PilotInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import type { PilotProceedingFileInterface } from '~/resources/scripts/interfaces/PilotProceedingFileInterface';
import type { ProceedingFileInterface } from '~/resources/scripts/interfaces/ProceedingFileInterface';
import PilotProceedingFileService from '~/resources/scripts/services/PilotProceedingFileService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'pilotProceedingFile',
  props: {
    pilot: { type: Object as PropType<PilotInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    pilotProceedingFilesList: [] as PilotProceedingFileInterface[],
    proceedingFilesList: [] as ProceedingFileInterface[],
    selectedProceedingFileId: null as number | null,
    pilotProceedingFile: null as PilotProceedingFileInterface | null,
    pilotProceedingFileActiveId: 0 as number | null,
    drawerPilotProceedingFileForm: false,
    drawerPilotProceedingFileDelete: false,
    selectedDateTimeDeleted: '' as string | null
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getPilotProceedingFiles()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
   
  },
  methods: {
    async getPilotProceedingFiles() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.pilotProceedingFilesList = []
      const pilotId = this.pilot.pilotId ? this.pilot.pilotId : 0
      const pilotProceedingFileService = new PilotProceedingFileService()
      const pilotProceedingFileResponse = await pilotProceedingFileService.getByPilot(pilotId)
      this.pilotProceedingFilesList = pilotProceedingFileResponse.proceedingFiles
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newPilotProceedingFile: PilotProceedingFileInterface = {
        pilotProceedingFileId: null,
        pilotId: this.pilot.pilotId,
        proceedingFileId: null,
        pilotProceedingFileCreatedAt: null,
        pilotProceedingFileUpdatedAt: null,
        pilotProceedingFileDeletedAt: null
      }
      this.pilotProceedingFile = newPilotProceedingFile
      this.drawerPilotProceedingFileForm = true
    },
    async onSave(pilotProceedingFile: PilotProceedingFileInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.pilotProceedingFile = {...pilotProceedingFile}
      
      const index = this.pilotProceedingFilesList.findIndex((pilotProceedingFile: PilotProceedingFileInterface) => pilotProceedingFile.pilotProceedingFileId === this.pilotProceedingFile?.pilotProceedingFileId)
      if (index !== -1) {
        this.pilotProceedingFilesList[index] = pilotProceedingFile
        this.$forceUpdate()
      } else {
        this.pilotProceedingFilesList.push(pilotProceedingFile)
        this.$forceUpdate()
      }
      this.drawerPilotProceedingFileForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(pilotProceedingFile: PilotProceedingFileInterface) {
      this.pilotProceedingFile = {...pilotProceedingFile}
      this.drawerPilotProceedingFileForm = true
    },
    onDelete(pilotProceedingFile: PilotProceedingFileInterface) {
      this.pilotProceedingFile = {...pilotProceedingFile}
      this.selectedDateTimeDeleted = ''
      this.drawerPilotProceedingFileDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.pilotProceedingFile) {
        this.drawerPilotProceedingFileDelete = false
        const pilotProceedingFileService = new PilotProceedingFileService()
        const pilotProceedingFileResponse = await pilotProceedingFileService.delete(this.pilotProceedingFile)
        if (pilotProceedingFileResponse.status === 200) {
          const index = this.pilotProceedingFilesList.findIndex((pilotProceedingFile: PilotProceedingFileInterface) => pilotProceedingFile.pilotProceedingFileId === this.pilotProceedingFile?.pilotProceedingFileId)
          if (index !== -1) {
            this.pilotProceedingFilesList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete proceeding file pilot',
            detail: pilotProceedingFileResponse._data.message,
              life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete proceeding file pilot',
            detail: pilotProceedingFileResponse._data.message,
              life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})