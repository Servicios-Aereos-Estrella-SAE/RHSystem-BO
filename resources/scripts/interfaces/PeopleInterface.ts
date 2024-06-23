interface PeopleInterface {
  personId: number,
  personFirstname: string,
  personLastname: string,
  personSecondLastname: string,
  personPhone: string,
  personGender: string,
  personBirthday: string,
  personCurp: string,
  personRfc: string,
  personImssNss: string,
  personCreatedAt: Date | string | null,
  personUpdatedAt: Date | string | null,
  personDeletedAt: Date | string | null
}

export type { PeopleInterface }
