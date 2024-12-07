import { defineComponent } from 'vue';
import type { ShiftExceptionInterface } from "~/resources/scripts/interfaces/ShiftExceptionInterface";
import type { EmployeeInterface } from "~/resources/scripts/interfaces/EmployeeInterface";
import { DateTime } from 'luxon';

export default defineComponent({
  name: 'ShiftExceptionInfoCard',
  props: {
    shiftException: {
      type: Object as () => ShiftExceptionInterface,
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
    clickOnDelete: {
      type: Function,
      default: null
    },
    clickOnEdit: {
      type: Function,
      default: null
    },
    canUpdate: {
      type: Boolean,
      default: false,
      required: true
    },
    canDelete: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data: () => ({
    selectedExceptionDate: new Date() as Date,
    drawerShiftExceptionForm: false,
    employee: null as EmployeeInterface | null
  }),
  mounted() {
    if (this.shiftException) {
      if (this.shiftException.employee) {
        this.employee = this.shiftException.employee
        this.selectedExceptionDate = DateTime.fromISO(`${this.shiftException.requestedDate}T00:00:00.000-06:00`, { setZone: true }).setZone('America/Mexico_City').toJSDate()
      }
    }
  },
  computed: {
    calendarDay() {
      const dateToException = DateTime.fromISO(this.shiftException.requestedDate, { zone: 'utc' })

      return dateToException.setLocale('en').toFormat('DDDD HH:mm')
    },
  },
  methods: {
    handlerClickOnEdit() {
      if (this.clickOnEdit) {
        this.clickOnEdit();
      }
    },
    handlerClickOnDecline() {
      if (this.clickOnDelete) {
        this.clickOnDelete();
      }
    },
    onSave() {

    }
  }
});
