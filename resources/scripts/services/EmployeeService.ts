
export default class EmployeeService {
  getByDepartmentPosition () {
    return {
      data: {
        response: [
          {
            name: 'Alejandro Arturo Camacho Nava',
            employee_id: '789789567'
          },
          {
            name: 'Raúl Jesús Rojas Ortega',
            employee_id: '1234234'
          }
        ]
      }
    }
  }
}
