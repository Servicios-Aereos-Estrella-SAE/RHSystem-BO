// script.ts
import { defineComponent, ref, onMounted } from 'vue';
import { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface'
import GalleryService from '~/resources/scripts/services/GalleryService'; 

interface GalleryImage {
  id: number;
  galeryPath: string;
  galeryCategory: string;
  galeryIdTable: number;
  galeryNameTable: string;
  galeryCreatedAt: string;
  galeryUpdatedAt: string;
  galeryDeletedAt: string | null;
}

export default defineComponent({
  name: 'GalleryCard',
  props: {
    aircraft: { type: Object as PropType<AircraftInterface>, required: true },
  },
  data() {
    return {
      gallery: ref<GalleryImage[]>([]),
    };
  },
  methods: {
    async fetchGallery() {
        const galleryService = new GalleryService();
        try {
            const response = await galleryService.fetchGallery(this.aircraft.aircraftId);
            this.gallery = response.data.data.data;
      } catch (error) {
        console.error('Error fetching gallery:', error);
      }
    }
  },
  mounted() {
    this.fetchGallery();
  }
});
