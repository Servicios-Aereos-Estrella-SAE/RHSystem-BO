import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import { useRouter } from 'vue-router'
import DepartmentService from '~/resources/scripts/services/DepartmentService';
import { DateTime } from 'luxon';

export default defineComponent({
  name: 'DepartmentInfoCard',
  props: {
    department: {
      type: Object as PropType<DepartmentInterface>,
      required: true
    },
    clickOnEdit: { type: Function, default: null, required: false },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
    clickOnDelete: { type: Function, default: null, required: false },
    periodSelected: { type: Date, default: null, required: true }
  },
  data: () => ({
    rotationIndexGeneral: '0.00',
    rotationIndexCurrentYear: '0.00',
    rotationIndexMonth: '0.00'
  }),
  setup() {
    const router = useRouter()
    return { router }
  },
  watch: {
    'periodSelected' (val: Date) {
     this.getRotationIndexMonthFilter()
    },
  },
  mounted() {
    this.getRotationIndex()
  },
  methods: {
    handlerClickOnDetail(ids: any) {
      this.router.push({ path: '/departments/' + ids, })
    },
    handlerClickOnEdit() {
      if (this.clickOnEdit && this.department.departmentId !== 999) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete && this.department.departmentId !== 999) {
        this.clickOnDelete()
      }
    },
    async getRotationIndex() {
      if (this.department.departmentId) {
        const departmentService = new DepartmentService()
        const dateNow = DateTime.now().toFormat('yyyy-LL-dd')
        let departmentResponse = await departmentService.getRotationIndex(this.department.departmentId, '2001-01-01' ,dateNow)
        if (departmentResponse.status === 200) {
          this.rotationIndexGeneral = departmentResponse._data.data.rotationIndex ? departmentResponse._data.data.rotationIndex.toFixed(2) : '0.00'
        }
        departmentResponse = await departmentService.getRotationIndex(this.department.departmentId,  `${DateTime.now().toFormat('yyyy')}-01-01` ,dateNow)
        if (departmentResponse.status === 200) {
          this.rotationIndexCurrentYear = departmentResponse._data.data.rotationIndex ? departmentResponse._data.data.rotationIndex.toFixed(2) : '0.00'
        }
        this.getRotationIndexMonthFilter()
      }
    
    },
    async getRotationIndexMonthFilter() {
      if (this.department.departmentId) {
        const departmentService = new DepartmentService()
        const formattedDate = `${DateTime.fromJSDate(new Date(this.periodSelected)).toFormat('yyyy-MM')}-01`
        const date = new Date(this.periodSelected)
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        const formattedLastDay = lastDay.toISOString().split('T')[0]
        const departmentResponse = await departmentService.getRotationIndex(this.department.departmentId,  formattedDate ,formattedLastDay)
        if (departmentResponse.status === 200) {
          this.rotationIndexMonth = departmentResponse._data.data.rotationIndex ? departmentResponse._data.data.rotationIndex.toFixed(2) : '0.00'
        }
      }
    }
  }
});

