import { defineComponent } from 'vue';
import type { VacationInterface } from "~/resources/scripts/interfaces/VacationInterface";

export default defineComponent({
  name: 'VacationInfoCard',
  props: {
    vacation: {
      type: Object as () => VacationInterface,
      required: true
    },
    showEditButton: {
      type: Boolean,
      default: true
    },
    showDeleteButton: {
      type: Boolean,
      default: true
    },
    clickOnDelete: { type: Function, default: null },
    clickOnEdit: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }

  },
  methods: {
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
