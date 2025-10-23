export enum EmployeeSupplyStatus {
  ACTIVE = 'active',
  RETIRED = 'retired',
  SHIPPING = 'shipping'
}

export const EMPLOYEE_SUPPLY_STATUS_OPTIONS = [
  { label: 'Activo', value: EmployeeSupplyStatus.ACTIVE },
  { label: 'Retirado', value: EmployeeSupplyStatus.RETIRED },
  { label: 'En tránsito', value: EmployeeSupplyStatus.SHIPPING }
]
