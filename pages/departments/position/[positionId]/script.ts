import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useRuntimeConfig } from '#app';
import { useMyGeneralStore } from '~/store/general';
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface';

export default defineComponent({
  name: 'PositionDetail',

  setup() {
    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();
    const position = ref(null);
    const dataShifts = ref<ShiftInterface[] | null>(null);


    onMounted(async () => {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const positionId = route.params.positionId;
      if (positionId) {
        try {
          const positionResponse = await axios.get(`${config.public.BASE_API_PATH}/positions/${positionId}`);
          position.value = positionResponse.data.data.position;
          myGeneralStore.setFullLoader(false)
          fetchShiftDepartment(positionId);
        } catch (error) {
          console.error('Failed to fetch position details:', error);
        }
      } else {
        console.error('Position ID is undefined');
      }
    });

    const fetchShiftDepartment = async (departmentId: any) => {
      const myGeneralStore = useMyGeneralStore();
      try {
        const positionsResponse = await axios.get(`${config.public.BASE_API_PATH}/shift/`, {
          params: {
            positionId: departmentId
          }
        });
        dataShifts.value = positionsResponse.data.data.data.filter((shift: any) => shift.employee_count > 0);
      } catch (error) {
        console.error('Failed to fetch positions:', error);
      } finally {
        myGeneralStore.setFullLoader(false);
      }
    };

    const closeDetail = () => {
      router.push({ path: '/positions' }); 
    };

    return {
      position,
      dataShifts,
      closeDetail
    };
  }
});