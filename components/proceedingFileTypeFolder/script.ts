import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { ProceedingFileTypeInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeInterface';
import Tooltip from 'primevue/tooltip';


export default defineComponent({
  components: {
  },
  directives: {
    tooltip: Tooltip
  },
  name: 'proceedingFileTypeFolder',
  props: {
    folder: { type: Object as PropType<ProceedingFileTypeInterface>, required: true },
    canManageFiles: { type: Boolean, default: false, required: true }
  },
  emits: ['dblclick', 'dblclickContracts', 'addSubfolder'],
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
    async handlerDoubleClick() {
      this.clicks++
      if (this.clicks === 1) {
        this.timer = setTimeout(() => {
          this.clicks = 0
        }, this.delay)
      } else {
        clearTimeout(this.timer)
        this.clicks = 0
        if (this.folder.proceedingFileTypeSlug === 'employee-contracts') {
          this.$emit('dblclickContracts', this.folder)
        } else {
          this.$emit('dblclick', this.folder)
        }

      }
    },
    capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    addSubfolder() {
      this.$emit('addSubfolder', this.folder)
    }
  }
})
