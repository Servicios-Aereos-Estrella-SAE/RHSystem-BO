import { defineComponent } from 'vue';
import type { EmployeeInterface } from "~/resources/scripts/interfaces/EmployeeInterface";
import { DateTime } from 'luxon';
import type { ExceptionRequestInterface } from '~/resources/scripts/interfaces/ExceptionRequestInterface';

export default defineComponent({
  name: 'ExceptionRequestInfoCard',
  props: {
    exceptionRequest: {
      type: Object as () => ExceptionRequestInterface,
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
    drawerExceptionRequestForm: false,
    employee: null as EmployeeInterface | null
  }),
  mounted() {
    if (this.exceptionRequest) {
      if (this.exceptionRequest.employee) {
        this.employee = this.exceptionRequest.employee
        this.selectedExceptionDate = DateTime.fromISO(`${this.exceptionRequest.requestedDate}T00:00:00.000-06:00`, { setZone: true }).setZone('America/Mexico_City').toJSDate()
      }
    }
  },
  computed: {
    calendarDay() {
      const dateToException = DateTime.fromISO(this.exceptionRequest.requestedDate, { zone: 'utc' })

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
