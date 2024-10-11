import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import type { AircraftProceedingFileInterface } from '~/resources/scripts/interfaces/AircraftProceedingFileInterface';
import type { ProceedingFileInterface } from '~/resources/scripts/interfaces/ProceedingFileInterface';
import AircraftProceedingFileService from '~/resources/scripts/services/AircraftProceedingFileService';
import type { ProceedingFileTypeInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeInterface';
import ProceedingFileTypeService from '~/resources/scripts/services/ProceedingFileTypeService';
import ProceedingFile from '~/resources/scripts/models/ProceedingFile';


export default defineComponent({
  components: {
  },
  name: 'proceedingFileTypeFolder',
  props: {
    folder: { type: Object as PropType<ProceedingFileTypeInterface>, required: true }
  },
  data: () => ({
    clicks: 0 as number,
    timer: null as any,
    delay: 250 as number
  }),
  computed: {
  },
  mounted() {
  },
  methods: {
    async handlerDoubleClick () {
      this.clicks++
      if (this.clicks === 1) {
        this.timer = setTimeout( () => {
          this.clicks = 0
        }, this.delay)
      } else {
        clearTimeout(this.timer)
        this.clicks = 0
        this.$emit('dblclick', this.folder)
      }
    }
  }
})
