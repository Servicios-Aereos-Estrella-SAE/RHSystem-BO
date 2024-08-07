import type { EmployeeInterface } from "./EmployeeInterface"
import type { PeopleInterface } from "./PeopleInterface"

interface ItemMenuInterface {
  label: string,
  icon: string,
  command: () => void,
}

export type { ItemMenuInterface }
