import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeMedicalConditionInterface } from '~/resources/scripts/interfaces/EmployeeMedicalConditionInterface'
import type { MedicalConditionTypeInterface } from '~/resources/scripts/interfaces/MedicalConditionTypeInterface'
import MedicalConditionTypeService from '~/resources/scripts/services/MedicalConditionTypeService'

export default defineComponent({
  name: 'EmployeeMedicalConditionInfoCard',
  props: {
    employeeMedicalCondition: {
      type: Object as PropType<EmployeeMedicalConditionInterface>,
      required: true
    },
    canUpdate: {
      type: Boolean,
      default: false
    },
    canDelete: {
      type: Boolean,
      default: false
    },
    canManageUserResponsible: {
      type: Boolean,
      default: false
    },
    clickOnEdit: {
      type: Function,
      required: true
    },
    clickOnDelete: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      medicalConditionTypes: [] as MedicalConditionTypeInterface[]
    }
  },
  async mounted() {
    await this.loadMedicalConditionTypes()
  },
  methods: {
    async loadMedicalConditionTypes() {
      const medicalConditionTypeService = new MedicalConditionTypeService()
      this.medicalConditionTypes = await medicalConditionTypeService.getAll()
    },
    getMedicalConditionTypeName() {
      if (!this.medicalConditionTypes || this.medicalConditionTypes.length === 0) {
        return this.$t('loading')
      }
      const type = this.medicalConditionTypes.find(
        (type: MedicalConditionTypeInterface) =>
          type.medicalConditionTypeId === this.employeeMedicalCondition.medicalConditionTypeId
      )
      return type ? type.medicalConditionTypeName : this.$t('medical_condition_type_not_found')
    },
    getPropertyName(propertyId: number) {
      // Buscar el nombre de la propiedad en todos los tipos
      for (const type of this.medicalConditionTypes) {
        if (type.properties) {
          const property = type.properties.find(prop => prop.medicalConditionTypePropertyId === propertyId)
          if (property) {
            return property.medicalConditionTypePropertyName
          }
        }
      }
      return null // Return null for properties not found
    },
    getPropertyType(propertyId: number) {
      const property = this.medicalConditionTypes.find(type => type.properties?.some(p => p.medicalConditionTypePropertyId === propertyId))
      return property?.properties?.find(p => p.medicalConditionTypePropertyId === propertyId)?.medicalConditionTypePropertyDataType || null
    },
    getValidPropertyValues() {
      // Filtrar solo las propiedades que existen en los tipos médicos
      if (!this.employeeMedicalCondition.propertyValues) return []

      return this.employeeMedicalCondition.propertyValues.filter(propertyValue => {
        return this.getPropertyName(propertyValue.medicalConditionTypePropertyId) !== null
      })
    }
  }
})
