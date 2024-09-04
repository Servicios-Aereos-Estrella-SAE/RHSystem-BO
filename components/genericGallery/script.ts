// script.ts
import { defineComponent, ref, onMounted } from 'vue';
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface';
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
      galeryPath: null,
      photoForm: '',
      submitted: false,
      galeryCategory: '',
      activeIndex: 0,
      displayCustom: false,
      responsiveOptions: [
        {
          breakpoint: '1024px',
          numVisible: 5,
        },
        {
          breakpoint: '768px',
          numVisible: 3,
        },
        {
          breakpoint: '560px',
          numVisible: 1,
        },
      ],
      categories: [] as string[],
      filteredCategories: [] as string[],
      drawerGalleryDelete: false,
      imageIdToDelete: null as number | null,

    };
  },
  methods: {
    clickOnDeleteImage(imageId: number) {
      this.imageIdToDelete = imageId
      this.drawerGalleryDelete = true
    },
    async confirmDelete() {
      if (this.imageIdToDelete !== null) {
        try {
          const galleryService = new GalleryService()
          await galleryService.deleteImage(this.imageIdToDelete)
          this.fetchGallery()
          this.drawerGalleryDelete = false
          this.imageIdToDelete = null
        } catch (error) {
          console.error('Error deleting image:', error)
        }
      }
    },
    async fetchGallery() {
        const galleryService = new GalleryService();
        try {
          if (this.aircraft.aircraftId !== null) {
            const response = await galleryService.fetchGallery(this.aircraft.aircraftId)
            this.gallery = response.data.data.data

            const categories = this.gallery.map(image => image.galeryCategory)
            this.categories = Array.from(new Set(categories))
          } 
      } catch (error) {
        console.error('Error fetching gallery:', error)
      }
    },
    onFileChange(event: { target: { files: any[]; }; }) {
      const file = event.target.files[0]
      if (file) {
        this.galeryPath = file 
        this.photoForm = URL.createObjectURL(file)
        this.$emit('file-selected', file)
      }
    },
    async onSave() {
      this.submitted = true;

      if (!this.galeryCategory || !this.galeryPath) {
        return; 
      }

      const formData = new FormData();
      formData.append('galeryCategory', this.galeryCategory);
      if (this.aircraft.aircraftId !== null) {
      formData.append('galeryIdTable', this.aircraft.aircraftId.toString());
      }
      formData.append('galeryNameTable', 'aircrafts');
      formData.append('galleryImage', this.galeryPath, '1ef53890-c07a-4fb0-8c44-360409c4a391');

      const galleryService = new GalleryService();
      try {
        const response = await galleryService.uploadImage(formData);
        console.log('Image uploaded successfully:', response.data);
        this.fetchGallery(); 
        this.galeryCategory = '';
        this.galeryPath = null;
        this.photoForm = '';
        this.submitted = false;
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    },
    filterCategories() {
      if (this.galeryCategory) {
        this.filteredCategories = this.categories.filter(category =>
          category.toLowerCase().includes(this.galeryCategory.toLowerCase())
        );
      } else {
        this.filteredCategories = [];
      }
    },
    selectCategory(category: string) {
      this.galeryCategory = category;
      this.filteredCategories = [];
    }
  
  },
  
  mounted() {
    this.fetchGallery();
  },
  watch: {
    galeryCategory() {
      this.filterCategories();
    }
  }
});
