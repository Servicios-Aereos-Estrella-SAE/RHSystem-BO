import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRuntimeConfig } from '#app';
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface';
import { useMyGeneralStore } from '~/store/general';

export default defineComponent({
  name: 'AssignShiftInfoForm',
  props: {
    departmentName: {
      type: String,
      required: true
    },
    positions: {
      type: Array as () => ShiftInterface[],
      required: true
    }
  },
  setup(props, {emit}) {
    const config = useRuntimeConfig();
    const availableShifts = ref<ShiftInterface[]>([]);
    const selectedShift = ref<ShiftInterface | null>(null);
    const submitted = ref<boolean>(false);
    const drawerShiftDelete = ref<boolean>(false);
    const shiftApplySince = ref('');

    const fetchAvailableShifts = async () => {
      try {
        const response = await axios.get(`${config.public.BASE_API_PATH}/shift/`);
        availableShifts.value = response.data.data.data;
      } catch (error) {
        console.error('Failed to fetch available shifts:', error);
      }
    };

    const onSave = () => {
      submitted.value = true;
      if (selectedShift.value && shiftApplySince.value) {
        drawerShiftDelete.value = true;
      }
    };

    const confirmSave = async () => {
      emit('save-success');
      drawerShiftDelete.value = false;
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (selectedShift.value && shiftApplySince.value) {
        for (const position of props.positions) {
          for (const employee of position.employees) {
            try {
              const requestBody = {
                shiftId: selectedShift.value.shiftId,
                employeeId: employee.employeeId,
                employeShiftsApplySince: shiftApplySince.value
              };

              await axios.post(`${config.public.BASE_API_PATH}/employee_shifts`, requestBody);
              // console.log(`Successfully assigned shift ${selectedShift.value.shiftName} to employee ${employee.employeeFirstName} ${employee.employeeLastName}`);
            } catch (error) {
              console.error(`Failed to assign shift to employee ${employee.employeeFirstName} ${employee.employeeLastName}:`, error);
            }
          }
        }
      } else {
        console.error('Selected shift or apply since date is missing.');
      }
      myGeneralStore.setFullLoader(false)
      window.location.reload();
    };

    onMounted(() => {
      fetchAvailableShifts();
    });

    return {
      availableShifts,
      selectedShift,
      drawerShiftDelete,
      submitted,
      shiftApplySince,
      onSave,
      confirmSave
    };
  }
});
