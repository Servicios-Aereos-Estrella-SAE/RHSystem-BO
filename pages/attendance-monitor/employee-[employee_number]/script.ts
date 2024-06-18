import { defineComponent } from 'vue'
import type { VisualizationModeOptionInterface } from '../../../resources/scripts/interfaces/VisualizationModeOptionInterface'
import AttendanceMonitorController from '../../../resources/scripts/controllers/AttendanceMonitorController'
import { DateTime } from 'luxon'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'


export default defineComponent({
  name: 'AttendanceMonitorByEmployee',
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
    visualizationModeOptions: [
      { name: 'Annual', value: 'yearly', calendar_format: { mode: 'year', format: 'yy' }, selected: false },
      { name: 'Monthly', value: 'monthly', calendar_format: { mode: 'month', format: 'mm/yy' }, selected: false },
      { name: 'Weekly', value: 'weekly', calendar_format: { mode: 'date', format: 'dd/mm/yy' }, selected: false },
    ] as VisualizationModeOptionInterface[],
    visualizationMode: null as VisualizationModeOptionInterface | null,
    periodSelected: new Date() as Date,
    maxDate: new Date() as Date,
    employeeDepartmentPositionList: [] as any,
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
    weeklyStartDay () {
      const daysList =[]

      switch (this.visualizationMode?.value) {
        case 'monthly': {
          const date = DateTime.fromJSDate(this.periodSelected)
          const start = date.startOf('month')
          const daysInMonth = (start.daysInMonth || 0)
          
          for (let index = 0; index < daysInMonth; index++) {
            const currentDay = start.plus({ days: index })
            const year = parseInt(currentDay.toFormat('yyyy'))
            const month = parseInt(currentDay.toFormat('LL'))
            const day = parseInt(currentDay.toFormat('dd'))
  
            daysList.push({
              year,
              month,
              day
            })
          }
          break;
        }
        case 'weekly': {
          const date = DateTime.fromJSDate(this.periodSelected)
          const start = date.startOf('week')
          
          for (let index = 0; index < 7; index++) {
            const currentDay = start.plus({ days: index })
            const year = parseInt(currentDay.toFormat('yyyy'))
            const month = parseInt(currentDay.toFormat('LL'))
            const day = parseInt(currentDay.toFormat('dd'))
  
            daysList.push({
              year,
              month,
              day
            })
          }
          break;
        }
        default:
          break;
      }

      return daysList
    }
  },
  async mounted() {
    this.periodSelected = new Date()
    this.setDefaultVisualizationMode()
    this.setGraphsData()
    await this.setDepartmentPositionEmployeeList()

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
          position_name: 'Ingeniero de Procedimientos Aeronáuticos y Normatividad',
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
    async setDepartmentPositionEmployeeList () {
      const response = await new AttendanceMonitorController().getDepartmentPositionEmployees()
      this.employeeDepartmentPositionList = response
    },
    setGraphsData () {
      this.setPeriodData()
      this.setPeriodCategories()
      this.setGeneralData()
    },
    async handlerDeparmentSelect () {
      this.periodSelected = new Date()
      await this.setDepartmentPositionEmployeeList()
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