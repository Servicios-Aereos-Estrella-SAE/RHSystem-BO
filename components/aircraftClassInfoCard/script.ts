import { defineComponent } from 'vue';
import type { AircraftClassInterface } from "~/resources/scripts/interfaces/AircraftClassInterface";

export default defineComponent({
  name: 'AircraftClassInfoCard',
  props: {
    aircraftClass: {
      type: Object as () => AircraftClassInterface,
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
        this.clickOnEdit();
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete();
      }
    },
    truncateText(text: string, maxLength: number): string {
        if (text.length <= maxLength) {
          return text;
        }
        return text.substring(0, maxLength) + '...';
      }
      
  }
});
