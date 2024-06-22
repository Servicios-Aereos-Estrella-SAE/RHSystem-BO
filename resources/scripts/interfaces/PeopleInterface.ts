interface PeopleInterface {
  person_id: number,
  person_firstname: string,
  person_lastname: string,
  person_second_lastname: string,
  person_phone: string,
  person_gender: string,
  person_birthday: string,
  person_curp: string,
  person_rfc: string,
  person_imss_nss: string,
  person_created_at: Date | string | null,
  person_updated_at: Date | string | null,
  person_deleted_at: Date | string | null
}

export type { PeopleInterface }
