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
