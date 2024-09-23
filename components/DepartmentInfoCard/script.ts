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
    clickOnEdit: { type: Function, default: null, required: true },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
    clickOnDelete: { type: Function, default: null },

  },
  setup() {
    const router = useRouter()
    return { router }
  },
  methods: {
    
    handlerClickOnDetail(ids: any) {
      this.router.push({ path: '/departments/' + ids, })
    },
    handlerClickOnEdit() {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    }
  }
});

