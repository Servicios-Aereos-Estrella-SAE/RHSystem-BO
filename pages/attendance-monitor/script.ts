import { defineComponent } from 'vue'
import { DateTime } from 'luxon'

import AttendanceMonitorController from '~/resources/scripts/controllers/AttendanceMonitorController'

import type { VisualizationModeOptionInterface } from '~/resources/scripts/interfaces/VisualizationModeOptionInterface'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'


export default defineComponent({
  name: 'AttendanceMonitorByDepartment',
  props: {
  },
  data: () => ({
    generalData: {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: '',
        align: 'left'
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Asistencia',
        colorByPoint: true,
        data: [] as Array<Object>
      }]
    },
    periodData: {
      chart: {
        type: 'column',
        scrollablePlotArea: {
          minWidth: 1024,
          scrollPositionX: 1
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: [] as string[]
      },
      yAxis: {
        title: {
          text: ''
        },
        min: 0,
        max: 100
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b><br/>',
        valueSuffix: '%',
        shared: false
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          allowPointSelect: true,
          cursor: 'pointer',
          enableMouseTracking: true,
        }
      },
      series: [] as Array<Object>
    },
    departmentList: [] as DepartmentInterface[],
    departmenSelected: null as DepartmentInterface | null,
    visualizationModeOptions: [
      { name: 'Annual', value: 'yearly', calendar_format: { mode: 'year', format: 'yy' }, selected: true },
      { name: 'Monthly', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false },
      { name: 'Weekly', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false },
    ] as VisualizationModeOptionInterface[],
    visualizationMode: null as VisualizationModeOptionInterface | null,
    periodSelected: new Date() as Date,
    maxDate: new Date() as Date,
    departmentPositionList: [] as any,

    employeeList: [] as EmployeeInterface[],
    selectedEmployee: null as EmployeeInterface | null,
    filteredEmployees: [] as EmployeeInterface[]
  }),
  computed: {
    lineChartTitle () {
      if (this.visualizationMode?.value === 'yearly') {
        const date = DateTime.fromJSDate(this.periodSelected).setLocale('en')
        return `Monthly behavior by the year, ${date.toFormat('yyyy')}`
      }

      if (this.visualizationMode?.value === 'monthly') {
        const date = DateTime.fromJSDate(this.periodSelected).setLocale('en')
        return `Behavior in ${date.toFormat('MMMM')}, ${date.toFormat('yyyy')}`
      }

      if (this.visualizationMode?.value === 'weekly') {
        return 'Weekly behavior'
      }
    },
    departmentCollection () {
      const list = JSON.parse(JSON.stringify(this.departmentList))
      const collection = list.map((item: DepartmentInterface) => ({ ...item, label: item.department_alias || item.department_name }))
      return collection
    }
  },
  async mounted() {
    this.periodSelected = new Date()
    this.setDefaultVisualizationMode()
    await this.setDepartmetList()
    this.setGraphsData()
    await this.setDepartmentPositions()

    this.employeeList = [
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
  },
  methods: {
    setDefaultVisualizationMode () {
      const index = this.visualizationModeOptions.findIndex(opt => opt.value === 'weekly')

      if (index >= 0) {
        this.visualizationMode = this.visualizationModeOptions[index]
      }

      this.handlerVisualizationModeChange()
    },
    setGeneralData () {
      this.generalData.series[0].data = new AttendanceMonitorController().getDepartmentTotalData(this.visualizationMode?.value || 'weekly')
    },
    setPeriodData () {
      this.periodData.series = new AttendanceMonitorController().getDepartmentPeriodData(this.visualizationMode?.value || 'weekly', this.periodSelected)
    },
    setPeriodCategories () {
      this.periodData.xAxis.categories = new AttendanceMonitorController().getDepartmentPeriodCategories(this.visualizationMode?.value || 'weekly', this.periodSelected)
    },
    setDepartmetList () {
      this.departmentList = [{
        department_id: 1,
        department_sync_id: '',
        department_code: '',
        department_name: 'Rampa',
        department_alias: null,
        department_is_default: '',
        department_active: '',
        parent_department_id: null,
        parent_department_sync_id: '',
        company_id: null,
        department_last_synchronization_at: null,
        department_created_at: null,
        department_updated_at: null,
        department_deleted_at: null
      }]
    },
    async setDepartmentPositions () {
      const response = await new AttendanceMonitorController().getDepartmentPositions()
      this.departmentPositionList = response
    },
    setGraphsData () {
      this.setPeriodData()
      this.setPeriodCategories()
      this.setGeneralData()
    },
    async handlerDeparmentSelect () {
      this.periodSelected = new Date()
      await this.setDepartmentPositions()
      this.setGraphsData()
    },
    handlerVisualizationModeChange () {
      const idx = this.visualizationModeOptions.findIndex(mode => mode.value === this.visualizationMode?.value)
      this.visualizationModeOptions.forEach(mode => mode.selected = false)

      if (idx >= 0) {
        this.visualizationModeOptions[idx].selected =  true
      }

      this.periodSelected = new Date()
      this.setGraphsData()
    },
    handlerPeriodChange () {
      this.setGraphsData()
    },
    handlerSearchEmployee(event: any) {
      setTimeout(() => {
          if (event.query.trim().length) {
            this.filteredEmployees = this.employeeList.filter((employee) => {
              return employee.employee_first_name.toLowerCase().startsWith(event.query.toLowerCase());
            });
          }
      }, 250);
    },
    onEmployeeSelect () {
      if (this.selectedEmployee && this.selectedEmployee.employee_code) {
        this.$router.push(`/attendance-monitor/employee-${this.selectedEmployee.employee_code}`)
      }
    }
  }
})