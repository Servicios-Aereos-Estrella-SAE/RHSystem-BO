import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useRuntimeConfig } from '#app';
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface';
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface';
import { useMyGeneralStore } from '~/store/general';
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface';

export default defineComponent({
  name: 'DepartmentDetail',
  setup() {
    const route = useRoute();
    const config = useRuntimeConfig();
    const department = ref<DepartmentInterface | null>(null);
    const positions = ref<PositionInterface[] | null>(null);
    const dataShifts = ref<ShiftInterface[] | null>(null);
    const search = ref<string>('');
    const drawerShiftForm = ref<boolean>(false); 

    const fetchPositions = async (departmentId: string, positionName: string | null = null) => {
      const myGeneralStore = useMyGeneralStore();
      try {
        const positionsResponse = await axios.get(`${config.public.BASE_API_PATH}/departments/search/${departmentId}/positions`, {
          params: {
            positionName
          }
        });
        positions.value = positionsResponse.data.data.positions;
      } catch (error) {
        console.error('Failed to fetch positions:', error);
      } finally {
        myGeneralStore.setFullLoader(false);
      }
    };

    const fetchShiftDepartment = async (departmentId: any) => {
      const myGeneralStore = useMyGeneralStore();
      try {
        const positionsResponse = await axios.get(`${config.public.BASE_API_PATH}/shift-department-position/`, {
          params: {
            departmentId
          }
        });
        dataShifts.value = positionsResponse.data.data.data.filter((shift: any) => shift.employee_count > 0);
      } catch (error) {
        console.error('Failed to fetch positions:', error);
      } finally {
        myGeneralStore.setFullLoader(false);
      }
    };

    const handlerSearchPosition = () => {
      const departmentId = route.params.departmentId ? route.params.departmentId.toString() : null;
      if (departmentId) {
        fetchPositions(departmentId, search.value);
      } else {
        console.error('Department ID is undefined');
      }
    };

    const asignShift = () => {
      drawerShiftForm.value = true; 
    };
    const handleSaveSuccess = () => {
      drawerShiftForm.value = false; 
    };
    const onSave = () => {
      const departmentId = route.params.departmentId
      if (departmentId) {
        fetchShiftDepartment(departmentId);
      }
    }
    onMounted(async () => {
      const departmentId = route.params.departmentId ? route.params.departmentId.toString() : null;
      if (departmentId) {
        try {
          const departmentResponse = await axios.get(`${config.public.BASE_API_PATH}/departments/${departmentId}`);
          department.value = departmentResponse.data.data.department;
          fetchPositions(departmentId);
          fetchShiftDepartment(departmentId);
        } catch (error) {
          console.error('Failed to fetch department details or positions:', error);
        }
      } else {
        console.error('Department ID is undefined');
      }
    });

    watch(search, (newSearch) => {
      handlerSearchPosition();
    });

    return {
      department,
      positions,
      dataShifts,
      search,
      drawerShiftForm,
      asignShift,
      handlerSearchPosition,
      handleSaveSuccess,
      onSave
    };
  }
});
