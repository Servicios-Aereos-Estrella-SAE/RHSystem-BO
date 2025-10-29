import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeMedicalConditionInterface, EmployeeMedicalConditionPropertyValueInterface } from '~/resources/scripts/interfaces/EmployeeMedicalConditionInterface'
import type { MedicalConditionTypeInterface } from '~/resources/scripts/interfaces/MedicalConditionTypeInterface'
import EmployeeMedicalConditionService from '~/resources/scripts/services/EmployeeMedicalConditionService'
import MedicalConditionTypeService from '~/resources/scripts/services/MedicalConditionTypeService'
import MedicalConditionTypePropertyService from '~/resources/scripts/services/MedicalConditionTypePropertyService'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'EmployeeMedicalConditionInfoForm',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    employeeMedicalCondition: {
      type: Object as PropType<EmployeeMedicalConditionInterface>,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    canManageUserResponsible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save', 'cancel'],
  data: () => ({
    isReady: false,
    submitted: false,
    activeSwicht: true,
    medicalConditionTypes: [] as MedicalConditionTypeInterface[],
    drawerMedicalConditionTypesManager: false,
  }),
  computed: {
    isNewMedicalCondition() {
      return !this.employeeMedicalCondition.employeeMedicalConditionId
    },
    selectedMedicalConditionType() {
      if (!this.employeeMedicalCondition.medicalConditionTypeId) return null
      return this.medicalConditionTypes.find(
        type => type.medicalConditionTypeId === this.employeeMedicalCondition.medicalConditionTypeId
      )
    },
    displayedMedicalConditionTypes() {
    return this.medicalConditionTypes.map(type => ({
      ...type,
      medicalConditionTypeName: type.medicalConditionTypeActive === 1
        ? type.medicalConditionTypeName
        : `${type.medicalConditionTypeName} (${this.t('inactive')})`,
      disabled: type.medicalConditionTypeActive !== 1
    }))
  }
  },
  watch: {
    'employeeMedicalCondition.medicalConditionTypeId'(newTypeId) {
      // Fetch properties from API
      if (newTypeId) {
        this.selectedMedicalConditionType = this.medicalConditionTypes.find(
          type => type.medicalConditionTypeId === newTypeId
        );
        this.loadMedicalConditionTypeProperties(newTypeId);
      }
    }
  },
  async mounted() {
    await this.loadMedicalConditionTypes()
    this.activeSwicht = this.employeeMedicalCondition.employeeMedicalConditionActive === 1
    this.isReady = true
  },
  methods: {
    async loadMedicalConditionTypes() {
      try {
        const medicalConditionTypeService = new MedicalConditionTypeService()
        this.medicalConditionTypes = await medicalConditionTypeService.getAll()
      } catch (error) {
        console.error('Error loading medical condition types:', error)
      }
    },
    async loadMedicalConditionTypeProperties(medicalConditionTypeId: number) {
      try {
        const medicalConditionTypePropertyService = new MedicalConditionTypePropertyService();
        const response = await medicalConditionTypePropertyService.show(medicalConditionTypeId);
        if (response.status === 200) {
          this.selectedMedicalConditionType.properties = response._data.data.medicalConditionTypeProperty;
        } else {
          this.selectedMedicalConditionType.properties = [];
        }
      } catch (error) {
        console.error('Error loading medical condition type properties:', error);
        this.selectedMedicalConditionType.properties = [];
      }
    },
    getPropertyValue(propertyId: number): EmployeeMedicalConditionPropertyValueInterface {
      if (!this.employeeMedicalCondition.propertyValues) {
        this.employeeMedicalCondition.propertyValues = []
      }

      let propertyValue = this.employeeMedicalCondition.propertyValues.find(
        pv => pv.medicalConditionTypePropertyId === propertyId
      )

      if (!propertyValue) {
        propertyValue = {
          medicalConditionTypePropertyId: propertyId,
          medicalConditionTypePropertyValue: '',
          medicalConditionTypePropertyValueActive: 1
        }
        this.employeeMedicalCondition.propertyValues.push(propertyValue)
      }

      return propertyValue
    },
    getValidProperties() {
      // Filtrar solo las propiedades que existen en el tipo médico seleccionado
      if (!this.selectedMedicalConditionType || !this.selectedMedicalConditionType.properties) return []

      return this.selectedMedicalConditionType.properties.filter(property => {
        // Verificar que la propiedad existe en los tipos médicos cargados
        return this.medicalConditionTypes.some(type =>
          type.properties?.some(p => p.medicalConditionTypePropertyId === property.medicalConditionTypePropertyId)
        )
      })
    },
    async onSave() {
      this.submitted = true

      if (!this.employeeMedicalCondition.medicalConditionTypeId ||
          !this.employeeMedicalCondition.employeeMedicalConditionDiagnosis) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }

      if (!new EmployeeMedicalConditionService().validateInfo(this.employeeMedicalCondition)) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }

      // Actualizar el estado activo
      this.employeeMedicalCondition.employeeMedicalConditionActive = this.activeSwicht ? 1 : 0

      // Actualizar el estado activo de las propiedades
      if (this.employeeMedicalCondition.propertyValues) {
        this.employeeMedicalCondition.propertyValues.forEach(propertyValue => {
          propertyValue.medicalConditionTypePropertyValueActive = 1
        })
      }

      const employeeMedicalConditionService = new EmployeeMedicalConditionService()
      let response
      if (this.isNewMedicalCondition) {
        response = await employeeMedicalConditionService.store(this.employeeMedicalCondition)
      } else {
        response = await employeeMedicalConditionService.update(this.employeeMedicalCondition)
      }

      if (response.status === 200 || response.status === 201) {
        this.$toast.add({
          severity: 'success',
          summary: `Condición médica ${this.employeeMedicalCondition.employeeMedicalConditionId ? this.t('updated') : this.t('created')}`,
          detail: response._data.message,
          life: 5000,
        })
        this.$emit('save', response._data.data)
      } else {
        const severityType = response.status === 500 ? 'error' : 'warn'
        const msgError = response._data.error ? response._data.error : response._data.message
        this.$toast.add({
          severity: severityType,
          summary: `Condición médica ${this.employeeMedicalCondition.employeeMedicalConditionId ? this.t('updated') : this.t('created')}`,
          detail: msgError,
          life: 5000,
        })
      }
    },
    openMedicalConditionTypesManager() {
      this.drawerMedicalConditionTypesManager = true
    },
    closeMedicalConditionTypesManager() {
      this.drawerMedicalConditionTypesManager = false
      // Recargar los tipos médicos después de cerrar el manager
      this.loadMedicalConditionTypes()
    },
    async onMedicalConditionTypeCreated(medicalConditionType: MedicalConditionTypeInterface) {
      // Agregar el nuevo tipo a la lista local
      this.medicalConditionTypes.push(medicalConditionType)
      this.$forceUpdate()
    }
  }
})
