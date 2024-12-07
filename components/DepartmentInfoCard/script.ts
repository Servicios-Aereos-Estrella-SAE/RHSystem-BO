import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import { useRouter } from 'vue-router'

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
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  mounted() {
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
    }
  }
});

