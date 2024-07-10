import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useRuntimeConfig } from '#app';

export default defineComponent({
  name: 'PositionDetail',

  setup() {
    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();
    const position = ref(null);

    onMounted(async () => {
      const positionId = route.params.positionId;
      if (positionId) {
        try {
          const positionResponse = await axios.get(`${config.public.BASE_API_PATH}/positions/${positionId}`);
          position.value = positionResponse.data.data.position;
        } catch (error) {
          console.error('Failed to fetch position details:', error);
        }
      } else {
        console.error('Position ID is undefined');
      }
    });

    const closeDetail = () => {
      router.push({ path: '/positions' }); 
    };

    return {
      position,
      closeDetail
    };
  }
});