import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useRuntimeConfig } from '#app';
import { useMyGeneralStore } from '~/store/general';
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface';
import DepartmentService from '~/resources/scripts/services/DepartmentService';

export default defineComponent({
  name: 'PositionDetail',

  setup() {
    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();
    const department = ref(null);
    const position = ref(null);
    const dataShifts = ref<ShiftInterface[] | null>(null);
    const drawerShiftForm = ref<boolean>(false); 


    onMounted(async () => {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const departmentId = route.params.departmentId;
      if (departmentId) {
        const departmentService = new DepartmentService()
        const departmentResponse = await departmentService.show(parseInt(`${departmentId}`))
        if (departmentResponse.status === 200) {
          department.value = departmentResponse._data.data.department
        }
      }
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

    const asignShift = () => {
      drawerShiftForm.value = true; 
    };

    const handleSaveSuccess = () => {
      drawerShiftForm.value = false; 
    };

    const onSave = () => {
      const positionId = route.params.positionId
      if (positionId) {
        fetchShiftDepartment(positionId)
      }
    }

    const fetchShiftDepartment = async (departmentId: any) => {
      const myGeneralStore = useMyGeneralStore();
      try {
        const positionsResponse = await axios.get(`${config.public.BASE_API_PATH}/shift-department-position/`, {
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
      department,
      dataShifts,
      drawerShiftForm,
      closeDetail,
      asignShift,
      handleSaveSuccess,
      onSave
    };
  }
});