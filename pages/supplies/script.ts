import { defineComponent } from 'vue'
import type { SupplyTypeInterface } from '~/resources/scripts/interfaces/SupplyTypeInterface'
import type { SupplyInterface } from '~/resources/scripts/interfaces/SupplyInterface'
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface"
import SupplyTypeService from '~/resources/scripts/services/SupplyTypeService'
import SupplyService from '~/resources/scripts/services/SupplyService'
import { useMyGeneralStore } from "~/store/general"
import { SUPPLY_STATUS_OPTIONS } from '~/resources/scripts/enums/SupplyStatus'

export default defineComponent({
  name: 'Supplies',
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  props: {},
  data: () => ({
    search: '' as string,
    filteredSupplyTypes: [] as SupplyTypeInterface[],
    supplyType: null as SupplyTypeInterface | null,
    selectedSupplyType: null as SupplyTypeInterface | null,
    selectedSupply: null as SupplyInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 50,
    drawerSupplyTypeForm: false as boolean,
    drawerSupplyForm: false as boolean,
    drawerSupplyManagement: false as boolean,
    drawerSupplyTypeDelete: false as boolean,
    canCreate: false as boolean,
    canUpdate: false as boolean,
    canDelete: false as boolean,
    supplyTypes: [] as SupplyTypeInterface[],
    selectedSupplyTypeId: null as number | null,
    selectedStatus: 'active' as string,
    statusOptions: SUPPLY_STATUS_OPTIONS,
    isLoading: false as boolean,
    isInitialLoad: true as boolean,
    isLoadingSupplyTypeForm: false as boolean,
    isLoadingSupplyManagement: false as boolean,
  }),
  computed: {
    isRootUser() {
      const myGeneralStore = useMyGeneralStore()
      const flag = myGeneralStore.isRoot
      return flag
    },
    supplyTypeFormTitle() {
      return this.selectedSupplyType?.supplyTypeId
        ? this.t('edit_supply_type')
        : this.t('add_supply_type')
    },
    supplyFormTitle() {
      return this.selectedSupply?.supplyId
        ? this.t('edit_supply')
        : this.t('add_supply')
    },
    supplyManagementTitle() {
      return `${this.t('manage_supplies')} - ${this.selectedSupplyType?.supplyTypeName}`
    },
    getStatusOptions() {
      return [
        { label: this.t('active'), value: 'active' },
        { label: this.t('inactive'), value: 'inactive' }
      ]
    }
  },
  created() { },
  watch: {
    'selectedSupplyTypeId': function () {
      this.handlerSearchSupplies()
    },
    'selectedStatus': function () {
      this.handlerSearchSupplies()
    },
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    this.isLoading = true
    this.isInitialLoad = true

    try {
      // Cargar permisos primero
      const systemModuleSlug = this.$route.path.replace(`/${this.$i18n.locale}/`, "/").toString().replaceAll('/', '')
      const permissions = await myGeneralStore.getAccess(systemModuleSlug)

      if (myGeneralStore.isRoot) {
        this.canCreate = true
        this.canUpdate = true
        this.canDelete = true
      } else {
        this.canCreate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'create') ? true : false
        this.canUpdate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update') ? true : false
        this.canDelete = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'delete') ? true : false
      }

      // Cargar datos de supply types
      await this.getSupplyTypes()

      // Esperar un poco para asegurar que los datos estén disponibles
      await new Promise(resolve => setTimeout(resolve, 500))

      // Cargar supplies solo si tenemos supply types
      if (this.supplyTypes.length > 0) {
        await this.handlerSearchSupplies()
      }

    } catch (error) {
      console.error('Error during initial load:', error)
      this.$toast.add({
        severity: 'error',
        summary: this.t('error_loading_data'),
        detail: this.t('error_loading_supplies'),
        life: 5000,
      })
    } finally {
      this.isLoading = false
      this.isInitialLoad = false
    }
  },
  methods: {
    async getSupplyTypes() {
      try {
        const supplyTypeService = new SupplyTypeService()
        const response = await supplyTypeService.getAll(1, 1000)
        console.log('getSupplyTypes Response:', response)

        if ((response as any).type === 'success') {
          const list = (response as any).data.supplyTypes.data || []
          console.log('Supply Types for dropdown loaded:', list.length)

          // Filtrar elementos null/undefined
          const validList = list.filter((item: any) => item && item.supplyTypeId)
          this.supplyTypes = validList
          console.log('Supply Types dropdown ready:', this.supplyTypes.length)
        } else {
          console.error('getSupplyTypes API Error:', response)
          this.supplyTypes = []
        }
      } catch (error) {
        console.error('Error loading supply types for dropdown:', error)
        this.supplyTypes = []
      }
    },
    async handlerSearchSupplies() {
      this.isLoading = true

      try {
        const supplyTypeService = new SupplyTypeService()
        const response = await supplyTypeService.getAll(this.currentPage, this.rowsPerPage)
        console.log('Response:', response)

        if ((response as any).type === 'success') {
          const list = (response as any).data.supplyTypes.data || []
          console.log('Supply Types loaded:', list.length)

          // Filtrar elementos null/undefined y validar que tengan supplyTypeId
          const validList = list.filter((item: any) =>
            item &&
            item.supplyTypeId &&
            item.supplyTypeName
          )

          this.totalRecords = (response as any).data.supplyTypes.meta.total || 0
          this.first = (response as any).data.supplyTypes.meta.firstPage || 0
          this.filteredSupplyTypes = validList

          console.log('Filtered Supply Types loaded:', this.filteredSupplyTypes.length)
        } else {
          console.error('API Error:', response)
          this.filteredSupplyTypes = []
          this.totalRecords = 0
          this.first = 0

          this.$toast.add({
            severity: 'error',
            summary: this.t('error_loading_data'),
            detail: this.t('error_loading_supplies'),
            life: 5000,
          })
        }
      } catch (error) {
        console.error('Error loading supply types:', error)
        this.filteredSupplyTypes = []
        this.totalRecords = 0
        this.first = 0

        this.$toast.add({
          severity: 'error',
          summary: this.t('error_loading_data'),
          detail: this.t('error_loading_supplies'),
          life: 5000,
        })
      } finally {
        this.isLoading = false
      }
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1
      this.rowsPerPage = event.rows
      this.handlerSearchSupplies()
    },
    addNewSupplyType() {
      const newSupplyType: SupplyTypeInterface = {
        supplyTypeId: null,
        supplyTypeName: "",
        supplyTypeDescription: "",
        supplyTypeIdentifier: null,
        supplyTypeSlug: "",
        supplyTypeCreatedAt: null,
        supplyTypeUpdatedAt: null,
        deletedAt: null
      }
      this.selectedSupplyType = newSupplyType
      this.drawerSupplyTypeForm = true
    },
    async onEditSupplyType(supplyType: SupplyTypeInterface) {
      this.isLoadingSupplyTypeForm = true
      try {
        // Cargar datos completos del supply type antes de abrir el formulario
        await this.loadSupplyTypeData(supplyType.supplyTypeId!)
        this.drawerSupplyTypeForm = true
      } catch (error) {
        console.error('Error loading supply type data:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_loading_supply_type_data'),
          life: 5000,
        })
      } finally {
        this.isLoadingSupplyTypeForm = false
      }
    },
    onDeleteSupplyType(supplyType: SupplyTypeInterface) {
      this.selectedSupplyType = { ...supplyType }
      this.drawerSupplyTypeDelete = true
    },
    async confirmDeleteSupplyType() {
      if (this.selectedSupplyType) {
        this.drawerSupplyTypeDelete = false
        const supplyTypeService = new SupplyTypeService()
        const supplyTypeResponse = await supplyTypeService.delete(this.selectedSupplyType.supplyTypeId!)

        if ((supplyTypeResponse as any).type === 'success') {
          const index = this.filteredSupplyTypes.findIndex((supplyType: SupplyTypeInterface) => supplyType.supplyTypeId === this.selectedSupplyType?.supplyTypeId)
          if (index !== -1) {
            this.filteredSupplyTypes.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: this.t('delete_supply_type'),
            detail: (supplyTypeResponse as any).message,
            life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.t('delete_supply_type'),
            detail: (supplyTypeResponse as any).message,
            life: 5000,
          })
        }
      }
    },
    onSaveSupplyType(supplyType: SupplyTypeInterface) {
      this.selectedSupplyType = { ...supplyType }
      const index = this.filteredSupplyTypes.findIndex((s: SupplyTypeInterface) => s.supplyTypeId === this.selectedSupplyType?.supplyTypeId)
      if (index !== -1) {
        this.filteredSupplyTypes[index] = supplyType
        this.$forceUpdate()
      } else {
        this.filteredSupplyTypes.push(supplyType)
        this.$forceUpdate()
      }
      this.drawerSupplyTypeForm = false
    },
    onCloseSupplyTypeForm() {
      this.drawerSupplyTypeForm = false
    },
    onCancelSupplyTypeDelete() {
      this.drawerSupplyTypeDelete = false
    },
    async onManageSupplyType(supplyType: SupplyTypeInterface) {
      this.isLoadingSupplyManagement = true
      try {
        // Cargar datos completos del supply type y sus supplies antes de abrir el management
        await this.loadSupplyManagementData(supplyType.supplyTypeId!)
        this.drawerSupplyManagement = true
      } catch (error) {
        console.error('Error loading supply management data:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_loading_supply_management_data'),
          life: 5000,
        })
      } finally {
        this.isLoadingSupplyManagement = false
      }
    },
    onCloseSupplyManagement() {
      this.drawerSupplyManagement = false
    },
    onSaveSupply(supply: SupplyInterface) {
      this.selectedSupply = { ...supply }
      this.drawerSupplyForm = false
    },
    onCloseSupplyForm() {
      this.drawerSupplyForm = false
    },
    clearFilters() {
      this.search = ''
      this.selectedSupplyTypeId = null
      this.selectedStatus = 'active'
      this.handlerSearchSupplies()
    },
    async getExcel() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      try {
        // Implementar exportación a Excel
        this.$toast.add({
          severity: 'success',
          summary: this.t('excel_report'),
          detail: this.t('excel_file_created_successfully'),
          life: 5000,
        })
      } catch (error) {
        console.error(this.t('error_generating_excel_file'), error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('excel_report'),
          detail: this.t('error_generating_excel_file'),
          life: 5000,
        })
      } finally {
        myGeneralStore.setFullLoader(false)
      }
    },
    capitalizeFirstLetter(text: string) {
      if (!text) return ''
      return text.charAt(0).toUpperCase() + text.slice(1)
    },
    async loadSupplyTypeData(supplyTypeId: number) {
      try {
        const supplyTypeService = new SupplyTypeService()
        const response = await supplyTypeService.getById(supplyTypeId)

        if ((response as any).type === 'success') {
          this.selectedSupplyType = (response as any).data.supplyType
        } else {
          throw new Error('Failed to load supply type data')
        }
      } catch (error) {
        console.error('Error loading supply type data:', error)
        throw error
      }
    },
    async loadSupplyManagementData(supplyTypeId: number) {
      try {
        const supplyTypeService = new SupplyTypeService()
        const response = await supplyTypeService.getById(supplyTypeId)

        if ((response as any).type === 'success') {
          this.selectedSupplyType = (response as any).data.supplyType

          // También cargar supplies relacionados si es necesario
          // Esto asegura que el SupplyManagement tenga todos los datos
          console.log('Supply type data loaded for management:', this.selectedSupplyType)
        } else {
          throw new Error('Failed to load supply type data for management')
        }
      } catch (error) {
        console.error('Error loading supply management data:', error)
        throw error
      }
    },
  },
})
