import { defineComponent, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { PositionInterface } from "~/resources/scripts/interfaces/PositionInterface"
import PositionService from '~/resources/scripts/services/PositionService'

export default defineComponent({
  name: 'PositionInfoCart',
  emits: ['clickOnEdit', 'clickOnDelete'],
  props: {
    departmentId: { type: Number, required: true },
    position: { type: Object as PropType<PositionInterface>, required: true },
    canDelete: { type: Boolean, default: false, required: true }
  },
  setup(props, { emit }) {
    const router = useRouter()
    const positionData = ref<PositionInterface | null>(null)

    onMounted(async () => {
      await fetchPositionData()
    })

    const handlerClickOnEdit = () => {
      emit('clickOnEdit')
    }

    const handlerClickOnDetail = () => {
      const path = `/departments/${props.departmentId}/position/${props.position.positionId}`
      router.push({ path })
    }

    const handlerClickOnDelete = () => {
      emit('clickOnDelete')
    }

    const fetchPositionData = async () => {
      const res = await new PositionService().show(props.position.positionId)

      if (res.status !== 200) {
        throw showError({
          statusCode: 500,
          fatal: true,
          message: 'Invalid position data'
        })
      }
      
      positionData.value = res._data.data.position
    }

    return {
      router,
      positionData,
      handlerClickOnEdit,
      handlerClickOnDetail,
      handlerClickOnDelete
    }
  }
})
