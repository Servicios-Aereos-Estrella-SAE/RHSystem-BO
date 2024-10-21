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
    folderSelected: null as ProceedingFileTypeInterface | null,
    filesLoader: false as boolean,
    filterFolderText: '' as string,
    filterFileText: '' as string
  }),
  computed: {
    foldersFiltered (): ProceedingFileTypeInterface[] {
      if (!this.filterFolderText) {
        return this.proceedingFileTypesList
      }

      const filtered: ProceedingFileTypeInterface[] = this.proceedingFileTypesList.filter(folder =>  folder.proceedingFileTypeSlug.includes(this.filterFolderText))
      return filtered
    },
    childrenFoldersFiltered () {
      if (!this.folderSelected) {
        return []
      }

      if (!this.filterFolderText) {
        return this.folderSelected.children
      }

      if (this.folderSelected && this.folderSelected.children && this.folderSelected.children.length > 0) {
        const filtered: ProceedingFileTypeInterface[] = this.folderSelected.children.filter(folder =>  folder.proceedingFileTypeSlug.includes(this.filterFolderText))
        return filtered
      }
    },
    filesFolderFiltered (): AircraftProceedingFileInterface[] {
      if (!this.filterFileText) {
        return this.aircraftProceedingFilesList
      }

      const filtered: AircraftProceedingFileInterface[] = this.aircraftProceedingFilesList.filter((folder) =>
        this.slugify(folder.proceedingFile?.proceedingFileName || '').includes(this.filterFileText) ||
        this.slugify(folder.proceedingFile?.proceedingFileIdentify || '').includes(this.filterFileText) ||
        this.slugify(folder.proceedingFile?.proceedingFileUuid || '').includes(this.filterFileText)
      )
      return filtered
    }
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
    async getAircraftProceedingFilesType(typeId: number) {
      if (!this.folderSelected) {
        return false
      }

      const proceedingFileTypeService = new ProceedingFileTypeService()
      const proceedingFileTypeResponse: any = await proceedingFileTypeService.show(typeId)
      this.folderSelected = proceedingFileTypeResponse._data.data.proceedingFileType || null
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
      this.folderSelected = folder
      this.filesLoader = true
      await this.getAircraftProceedingFiles()
      this.filesLoader = false
    },
    async handlerUnselectFolder () {
      if (this.folderSelected && this.folderSelected.parentId) {
        await this.getAircraftProceedingFilesType(this.folderSelected.parentId)
        await this.getAircraftProceedingFiles()
        this.filterFileText = ''
      } else {
        this.folderSelected = null
        this.aircraftProceedingFilesList = []
        this.filterFileText = ''
      }
    },
    slugify(input: string) {
      if (!input) {
        return ''
      }

      let slug = input.toLowerCase().trim()
      slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim()
      slug = slug.replace(/[\s-]+/g, '-')
  
      return slug
    }
  }
})
