import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface';

export default defineComponent({
  name: 'DepartmentInfoCard',
  props: {
    department: {
      type: Object as PropType<DepartmentInterface>,
      required: true
    },
    showDetail: {
      type: Function as PropType<(department: DepartmentInterface) => void>,
      required: true
    }
  },
  methods: {
    handlerClickOnDetail() {
      this.showDetail(this.department);
    }
  }
});
