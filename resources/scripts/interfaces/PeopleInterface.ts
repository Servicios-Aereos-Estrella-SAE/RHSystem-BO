import type { EmployeeInterface } from "./EmployeeInterface"

interface PeopleInterface {
  personId: number | null,
  personFirstname: string,
  personLastname: string,
  personSecondLastname: string,
  personPhone: string | null,
  personEmail: string | null,
  personGender: string | null,
  personBirthday: Date | string | null,
  personCurp: string | null,
  personRfc: string | null,
  personImssNss: string | null,
  personPhoneSecondary: string | null,
  personMaritalStatus: string | null,
  personPlaceOfBirthCountry: string | null,
  personPlaceOfBirthState: string | null,
  personPlaceOfBirthCity: string | null,
  personCreatedAt: Date | string | null,
  personUpdatedAt: Date | string | null,
  personDeletedAt: Date | string | null

  employee?: EmployeeInterface
}

export type { PeopleInterface }
