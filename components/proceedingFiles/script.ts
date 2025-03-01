import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import type { ProceedingFileInterface } from '~/resources/scripts/interfaces/ProceedingFileInterface';
import EmployeeProceedingFileService from '~/resources/scripts/services/EmployeeProceedingFileService';
import type { ProceedingFileTypeInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeInterface';
import ProceedingFileTypeService from '~/resources/scripts/services/ProceedingFileTypeService';
import ProceedingFile from '~/resources/scripts/models/ProceedingFile';
import type { EmployeeProceedingFileInterface } from '~/resources/scripts/interfaces/EmployeeProceedingFileInterface';


export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'proceedingFiles',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    canReadOnlyFiles: { type: Boolean, default: false, required: true },
    canManageFiles: { type: Boolean, default: false, required: true }
  },
  data: () => ({
    isReady: false,
    employeeProceedingFilesList: [] as EmployeeProceedingFileInterface[],
    proceedingFilesList: [] as ProceedingFileInterface[],
    selectedProceedingFileId: null as number | null,
    employeeProceedingFile: null as EmployeeProceedingFileInterface | null,
    employeeProceedingFileActiveId: 0 as number | null,
    drawerEmployeeProceedingFileForm: false,
    drawerEmployeeProceedingFileDelete: false,
    selectedDateTimeDeleted: '' as string | null,
    proceedingFileTypesList: [] as ProceedingFileTypeInterface[],
    folderSelected: null as ProceedingFileTypeInterface | null,
    filesLoader: false as boolean,
    filterFolderText: '' as string,
    filterFileText: '' as string,
    drawerProceedingFileTypeEmailForm: false as boolean,
    drawerEmployeeRecords: false,
    drawerEmployeeContracts: false
  }),
  computed: {
    foldersFiltered(): ProceedingFileTypeInterface[] {

      if (!this.filterFolderText) {
        return this.proceedingFileTypesList
      }

      const filtered: ProceedingFileTypeInterface[] = this.proceedingFileTypesList.filter(folder => folder.proceedingFileTypeSlug.includes(this.filterFolderText))

      return filtered
    },
    childrenFoldersFiltered() {
      if (!this.folderSelected) {
        return []
      }

      if (!this.filterFolderText) {
        return this.folderSelected.children
      }

      if (this.folderSelected && this.folderSelected.children && this.folderSelected.children.length > 0) {
        const filtered: ProceedingFileTypeInterface[] = this.folderSelected.children.filter(folder => folder.proceedingFileTypeSlug.includes(this.filterFolderText))
        return filtered
      }
    },
    filesFolderFiltered(): EmployeeProceedingFileInterface[] {
      if (!this.filterFileText) {
        return this.employeeProceedingFilesList
      }

      const filtered: EmployeeProceedingFileInterface[] = this.employeeProceedingFilesList.filter((folder) =>
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
    async getEmployeeProceedingFiles() {
      if (!this.folderSelected) {
        return false
      }

      this.employeeProceedingFilesList = []
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const employeeProceedingFileService = new EmployeeProceedingFileService()
      const employeeProceedingFileResponse = await employeeProceedingFileService.getByEmployee(employeeId, this.folderSelected.proceedingFileTypeId as number)
      this.employeeProceedingFilesList = employeeProceedingFileResponse.data.data
    },
    async getEmployeeProceedingFilesType(typeId: number) {
      if (!this.folderSelected) {
        return false
      }

      const proceedingFileTypeService = new ProceedingFileTypeService()
      const proceedingFileTypeResponse: any = await proceedingFileTypeService.show(typeId)
      this.folderSelected = proceedingFileTypeResponse._data.data.proceedingFileType || null
    },
    addEmails() {
      if (!this.folderSelected) {
        return
      }
      this.drawerProceedingFileTypeEmailForm = true
    },
    addNew() {
      if (!this.folderSelected) {
        return
      }
      const fakeProceedingFile: ProceedingFileInterface = new ProceedingFile().toModelObject()
      fakeProceedingFile.proceedingFileTypeId = this.folderSelected.proceedingFileTypeId

      const newEmployeeProceedingFile: EmployeeProceedingFileInterface = {
        employeeProceedingFileId: null,
        employeeId: this.employee.employeeId,
        proceedingFileId: null,
        employeeProceedingFileCreatedAt: null,
        employeeProceedingFileUpdatedAt: null,
        employeeProceedingFileDeletedAt: null,
        proceedingFile: fakeProceedingFile
      }
      this.employeeProceedingFile = newEmployeeProceedingFile
      this.drawerEmployeeProceedingFileForm = true
    },
    async onSave(employeeProceedingFile: EmployeeProceedingFileInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeProceedingFile = { ...employeeProceedingFile }
      const index = this.employeeProceedingFilesList.findIndex((employeeProceedingFile: EmployeeProceedingFileInterface) => employeeProceedingFile.employeeProceedingFileId === this.employeeProceedingFile?.employeeProceedingFileId)
      if (index !== -1) {
        this.employeeProceedingFilesList[index] = employeeProceedingFile
        this.$forceUpdate()
      } else {
        this.employeeProceedingFilesList.push(employeeProceedingFile)
        this.$forceUpdate()
      }
      this.drawerEmployeeProceedingFileForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(employeeProceedingFile: EmployeeProceedingFileInterface) {
      this.employeeProceedingFile = { ...employeeProceedingFile }
      this.drawerEmployeeProceedingFileForm = true
    },
    onDelete(employeeProceedingFile: EmployeeProceedingFileInterface) {
      this.employeeProceedingFile = { ...employeeProceedingFile }
      this.selectedDateTimeDeleted = ''
      this.drawerEmployeeProceedingFileDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.employeeProceedingFile) {
        this.drawerEmployeeProceedingFileDelete = false
        const employeeProceedingFileService = new EmployeeProceedingFileService()
        const employeeProceedingFileResponse = await employeeProceedingFileService.delete(this.employeeProceedingFile)
        if (employeeProceedingFileResponse.status === 200) {
          const index = this.employeeProceedingFilesList.findIndex((employeeProceedingFile: EmployeeProceedingFileInterface) => employeeProceedingFile.employeeProceedingFileId === this.employeeProceedingFile?.employeeProceedingFileId)
          if (index !== -1) {
            this.employeeProceedingFilesList.splice(index, 1)
            this.$forceUpdate()
          }
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete proceeding file employee',
            detail: employeeProceedingFileResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
    async getProceedingFileTypes() {
      this.proceedingFileTypesList = []
      const proceedingFileTypeService = new ProceedingFileTypeService()
      const proceedingFileTypeResponse = await proceedingFileTypeService.getByArea('employee')
      this.proceedingFileTypesList = proceedingFileTypeResponse._data.data.proceedingFileTypes
      const folderContract: ProceedingFileTypeInterface = {
        proceedingFileTypeName: 'Contracts',
        proceedingFileTypeAreaToUse: '',
        proceedingFileTypeActive: 1,
        proceedingFileTypeSlug: 'employee-contracts',
        proceedingFileTypeId: null,
        parentId: null
      }
      this.proceedingFileTypesList.unshift(folderContract)
      const folderRecord: ProceedingFileTypeInterface = {
        proceedingFileTypeName: 'Records',
        proceedingFileTypeAreaToUse: '',
        proceedingFileTypeActive: 1,
        proceedingFileTypeSlug: 'employee-records',
        proceedingFileTypeId: null,
        parentId: null
      }
      this.proceedingFileTypesList.unshift(folderRecord)
    },
    async handlerDoubleClick(folder: ProceedingFileTypeInterface) {
      this.folderSelected = folder
      this.filesLoader = true
      await this.getEmployeeProceedingFiles()
      this.filesLoader = false
    },
    async handlerRecordsDoubleClick(folder: ProceedingFileTypeInterface) {
      this.folderSelected = folder
      this.filesLoader = true
      this.drawerEmployeeRecords = true
      this.filesLoader = false
    },
    async handlerContractsDoubleClick(folder: ProceedingFileTypeInterface) {
      this.folderSelected = folder
      this.filesLoader = true
      this.drawerEmployeeContracts = true
      this.filesLoader = false
    },
    async handlerUnselectFolder() {
      this.drawerEmployeeRecords = false
      this.drawerEmployeeContracts = false
      if (this.folderSelected && this.folderSelected.parentId) {
        await this.getEmployeeProceedingFilesType(this.folderSelected.parentId)
        await this.getEmployeeProceedingFiles()
        this.filterFileText = ''
      } else {
        this.folderSelected = null
        this.employeeProceedingFilesList = []
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
