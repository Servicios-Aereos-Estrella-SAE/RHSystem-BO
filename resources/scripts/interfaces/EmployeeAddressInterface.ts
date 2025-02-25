import type { AddressInterface } from "./AddressInterface"

interface EmployeeAddressInterface {
  employeeAddressId?: number | null
  employeeId: number | null
  addressId: number | null
  employeeAddressCreatedAt?: string | null
  employeeAddressUpdatedAt?: string | null
  deletedAt?: string | null
  address?: AddressInterface | null
}

export type { EmployeeAddressInterface }
