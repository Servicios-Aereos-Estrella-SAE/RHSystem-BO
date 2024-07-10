import { defineComponent } from 'vue';
import type { PositionInterface } from "~/resources/scripts/interfaces/PositionInterface";

export default defineComponent({
  props: {
    position: {
      type: Object as () => PositionInterface,
      required: true
    }
  },setup() {
    const router = useRouter()
    return { router }
  },
  methods: {
    
    handlerClickOnDetail(ids: any) {
      this.router.push({ path: './detail-position/' + ids , })
    }
  }


});
