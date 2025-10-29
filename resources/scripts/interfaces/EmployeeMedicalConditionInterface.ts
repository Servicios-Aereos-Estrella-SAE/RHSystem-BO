export interface EmployeeMedicalConditionInterface {
  employeeMedicalConditionId?: number
  employeeId: number
  medicalConditionTypeId: number
  employeeMedicalConditionDiagnosis: string
  employeeMedicalConditionTreatment: string
  employeeMedicalConditionNotes: string
  employeeMedicalConditionActive: number
  propertyValues?: EmployeeMedicalConditionPropertyValueInterface[]
}

export interface EmployeeMedicalConditionPropertyValueInterface {
  medicalConditionTypePropertyValueId?: number
  medicalConditionTypePropertyId: number
  employeeMedicalConditionId?: number
  medicalConditionTypePropertyValue: string
  medicalConditionTypePropertyValueActive: number
}
