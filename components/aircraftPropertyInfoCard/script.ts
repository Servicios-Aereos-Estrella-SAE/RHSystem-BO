import { defineComponent } from 'vue';
import type { AircraftPropertyInterface } from "~/resources/scripts/interfaces/AircraftPropertyInterface";

export default defineComponent({
  name: 'AircraftPropertyInfoCard',
  props: {
    aircraftProperty: {
      type: Object as () => AircraftPropertyInterface,
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
    }
  }
});
