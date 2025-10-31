import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { MedicalConditionTypeInterface } from '~/resources/scripts/interfaces/MedicalConditionTypeInterface'
import MedicalConditionTypeService from '~/resources/scripts/services/MedicalConditionTypeService'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'MedicalConditionTypesPage',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  data: () => ({
    isReady: false,
    medicalConditionTypesList: [] as MedicalConditionTypeInterface[],
    medicalConditionType: null as MedicalConditionTypeInterface | null,
    drawerMedicalConditionTypeForm: false,
    drawerMedicalConditionTypeDelete: false,
    canCreate: true,
    canManage: true,
  }),
  async mounted() {
    await this.loadMedicalConditionTypes()
    this.isReady = true
  },
  methods: {
    async loadMedicalConditionTypes() {
      try {
        const medicalConditionTypeService = new MedicalConditionTypeService()
        this.medicalConditionTypesList = await medicalConditionTypeService.getAll()
      } catch (error) {
        console.error('Error loading medical condition types:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error_loading_data'),
          detail: 'Error al cargar los tipos de condiciones médicas',
          life: 5000,
        })
      }
    },
    addNewMedicalConditionType() {
      const newMedicalConditionType: MedicalConditionTypeInterface = {
        medicalConditionTypeId: null,
        medicalConditionTypeName: '',
        medicalConditionTypeDescription: '',
        medicalConditionTypeActive: 1,
        properties: []
      }
      this.medicalConditionType = newMedicalConditionType
      this.drawerMedicalConditionTypeForm = true
    },
    onEditMedicalConditionType(medicalConditionType: MedicalConditionTypeInterface) {
      this.medicalConditionType = { ...medicalConditionType }
      this.drawerMedicalConditionTypeForm = true
    },
    onDeleteMedicalConditionType(medicalConditionType: MedicalConditionTypeInterface) {
      this.medicalConditionType = { ...medicalConditionType }
      this.drawerMedicalConditionTypeDelete = true
    },
    onCancelMedicalConditionTypeDelete() {
      this.drawerMedicalConditionTypeDelete = false
    },
    async confirmDeleteMedicalConditionType() {
      if (this.medicalConditionType) {
        this.drawerMedicalConditionTypeDelete = false
        const medicalConditionTypeService = new MedicalConditionTypeService()
        const response = await medicalConditionTypeService.delete(this.medicalConditionType)

        if (response.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: this.t('delete_medical_condition_type'),
            detail: response._data.message,
            life: 5000,
          })
          // Recargar la lista completa para evitar cuadros vacíos
          await this.loadMedicalConditionTypes()
        } else {
          const severityType = response.status === 500 ? 'error' : 'warn'
          const msgError = response._data.error ? response._data.error : response._data.message
          this.$toast.add({
            severity: severityType,
            summary: this.t('delete_medical_condition_type'),
            detail: msgError,
            life: 5000,
          })
        }
      }
    },
    async onSaveMedicalConditionType(medicalConditionType: MedicalConditionTypeInterface) {
      this.medicalConditionType = { ...medicalConditionType }
      const index = this.medicalConditionTypesList.findIndex((a: MedicalConditionTypeInterface) =>
        a.medicalConditionTypeId === this.medicalConditionType?.medicalConditionTypeId)
      if (index !== -1) {
        this.medicalConditionTypesList[index] = medicalConditionType
        this.$forceUpdate()
      } else {
        this.medicalConditionTypesList.push(medicalConditionType)
        this.$forceUpdate()
      }
      this.drawerMedicalConditionTypeForm = false

      // Recargar la lista completa para evitar cuadros vacíos
      await this.loadMedicalConditionTypes()
    }
  }
})
