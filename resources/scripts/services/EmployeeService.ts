
export default class EmployeeService {
  getByDepartmentPosition () {
    return {
      data: {
        response: [
          {
            employee_id: 1,
            employee_sync_id: '',
            employee_code: '50156872',
            employee_first_name: 'Wilvardo',
            employee_last_name: 'Ramirez Colunga',
            employee_payroll_num: '',
            employee_hire_date: '',
            company_id: 1,
            department_id: 1,
            position_id: 1,
            department_sync_id: '',
            position_sync_id: '',
            employee_last_synchronization_at: '',
            person_id: 1,
            employee_created_at: '',
            employee_updated_at: '',
            employee_deleted_at: '',
            person: {
              person_id: 1,
              person_firstname: 'Wilvardo',
              person_lastname: 'Ramirez',
              person_second_lastname: 'Colunga',
              person_phone: '',
              person_gender: '',
              person_birthday: '',
              person_curp: '',
              person_rfc: '',
              person_imss_nss: '',
              person_created_at:'',
              person_updated_at:'',
              person_deleted_at:''
            },
            department: {
              department_id: 1,
              department_sync_id: '',
              department_code: '',
              department_name: 'Sistemas',
              department_alias: 'Desarrollo de software',
              department_is_default: '',
              department_active: '',
              parent_department_id: null,
              parent_department_sync_id: '',
              company_id: null,
              department_last_synchronization_at: '',
              department_created_at: '',
              department_updated_at: '',
              department_deleted_at: ''
            },
            position: {
              position_id: 1,
              position_sync_id: '',
              position_code: '',
              position_name: 'SDL Head Leader',
              position_alias: '',
              position_is_default: 1,
              position_active: 1,
              parent_position_id: null,
              parent_position_sync_id: '',
              company_id: 1,
              position_last_synchronization_at: '',
              position_created_at: '',
              position_updated_at: '',
              position_deleted_at: ''
            }
          }
        ]
      }
    }
  }
}
