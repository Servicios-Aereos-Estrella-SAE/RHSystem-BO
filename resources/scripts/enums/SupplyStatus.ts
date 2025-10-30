export enum SupplyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOST = 'lost',
  DAMAGED = 'damaged'
}

export const SUPPLY_STATUS_OPTIONS = [
  { label: 'Todos', value: null },
  { label: 'Activo', value: SupplyStatus.ACTIVE },
  { label: 'Inactivo', value: SupplyStatus.INACTIVE },
  { label: 'Perdido', value: SupplyStatus.LOST },
  { label: 'Dañado', value: SupplyStatus.DAMAGED }
]

export const SUPPLY_STATUS_OPTIONS_EN = [
  { label: 'All', value: null },
  { label: 'Active', value: SupplyStatus.ACTIVE },
  { label: 'Inactive', value: SupplyStatus.INACTIVE },
  { label: 'Lost', value: SupplyStatus.LOST },
  { label: 'Damaged', value: SupplyStatus.DAMAGED }
]

export function getSupplyStatusOptions(language?: string) {
  let lang = (language || '').toLowerCase()
  if (!lang) {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('i18n_redirected') : null
      lang = (stored || 'es').toLowerCase()
    } catch {
      lang = 'es'
    }
  }
  if (lang.startsWith('en')) return SUPPLY_STATUS_OPTIONS_EN
  return SUPPLY_STATUS_OPTIONS
}
