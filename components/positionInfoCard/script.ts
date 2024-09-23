import { defineComponent } from 'vue';
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface';
import type { PositionInterface } from "~/resources/scripts/interfaces/PositionInterface";

export default defineComponent({
  props: {
    department: { type: Object as PropType<DepartmentInterface>, required: true },
    position: { type: Object as PropType<PositionInterface>, required: true },
    clickOnDelete: { type: Function, default: null, required: true },
    clickOnSoftDelete: { type: Function, default: null, required: true },
    canDelete: { type: Boolean, default: false, required: true },
    clickOnEdit: { type: Function, default: null },

  }, setup() {
    const router = useRouter()
    return { router }
  },
  methods: {
    handlerClickOnEdit() {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDetail(ids: any) {
      this.router.push({ path: this.department.departmentId + '/position/' + ids, })
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    handlerClickOnSoftDelete() {
      console.log("en el component soft delete")
      if (this.clickOnSoftDelete) {
        this.clickOnSoftDelete()
      }
    }
    
  }


});
