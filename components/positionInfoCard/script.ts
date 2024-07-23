import { defineComponent } from 'vue';
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface';
import type { PositionInterface } from "~/resources/scripts/interfaces/PositionInterface";

export default defineComponent({
  props: {
    department: { type: Object as PropType<DepartmentInterface>, required: true },
    position: { type: Object as PropType<PositionInterface>, required: true },
  },setup() {
    const router = useRouter()
    return { router }
  },
  methods: {
    
    handlerClickOnDetail(ids: any) {
      console.log(this.department)
      this.router.push({ path: this.department.departmentId + '/position/' + ids , })
    }
  }


});
