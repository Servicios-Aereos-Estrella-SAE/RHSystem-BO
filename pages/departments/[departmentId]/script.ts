import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useRuntimeConfig } from '#app';
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface';
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface';

export default defineComponent({
  name: 'DepartmentDetail',
  setup() {
    const route = useRoute()
    const config = useRuntimeConfig()
    const department = ref<DepartmentInterface | null>(null)
    const positions = ref<PositionInterface[] | null>(null)

    onMounted(async () => {
      const departmentId = route.params.departmentId ? route.params.departmentId : null
      if (departmentId) {
        try {
          const departmentResponse = await axios.get(`${config.public.BASE_API_PATH}/departments/${departmentId}`)
          department.value = departmentResponse.data.data.department

          const positionsResponse = await axios.get(`${config.public.BASE_API_PATH}/departments/${departmentId}/positions`)
          positions.value = positionsResponse.data.data.positions
        } catch (error) {
          console.error('Failed to fetch department details or positions:', error)
        }
      } else {
        console.error('Department ID is undefined')
      }
    })

    return {
      department,
      positions
    }
  }
})
