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

export const EMPLOYEE_SUPPLY_STATUS_OPTIONS_EN = [
  { label: 'Active', value: EmployeeSupplyStatus.ACTIVE },
  { label: 'Retired', value: EmployeeSupplyStatus.RETIRED },
  { label: 'In transit', value: EmployeeSupplyStatus.SHIPPING }
]

export function getEmployeeSupplyStatusOptions(language?: string) {
  let lang = (language || '').toLowerCase()
  if (!lang) {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('i18n_redirected') : null
      lang = (stored || 'es').toLowerCase()
    } catch {
      lang = 'es'
    }
  }
  if (lang.startsWith('en')) return EMPLOYEE_SUPPLY_STATUS_OPTIONS_EN
  return EMPLOYEE_SUPPLY_STATUS_OPTIONS
}
