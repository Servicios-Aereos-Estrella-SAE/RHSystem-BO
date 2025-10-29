export interface MedicalConditionTypeInterface {
  medicalConditionTypeId?: number
  medicalConditionTypeName: string
  medicalConditionTypeDescription: string
  medicalConditionTypeActive: number
  medicalConditionTypeCreatedAt?: string
  medicalConditionTypeUpdatedAt?: string
  deletedAt?: string
  properties?: MedicalConditionTypePropertyInterface[]
}

export interface MedicalConditionTypePropertyInterface {
  medicalConditionTypePropertyId?: number
  medicalConditionTypePropertyName: string
  medicalConditionTypePropertyDescription: string
  medicalConditionTypePropertyDataType: string
  medicalConditionTypePropertyRequired: number
  medicalConditionTypeId: number
  medicalConditionTypePropertyActive: number
  medicalConditionTypePropertyCreatedAt?: string
  medicalConditionTypePropertyUpdatedAt?: string
  deletedAt?: string
  medicalConditionType?: MedicalConditionTypeInterface
}
