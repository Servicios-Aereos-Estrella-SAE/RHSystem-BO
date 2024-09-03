// GalleryService.ts
import axios from 'axios';

class GalleryService {
  private baseUrl: string;
  protected API_PATH: string;

  constructor() {
    this.baseUrl = 'http://127.0.0.1:3333/api/galleries';
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH;

  }

  public async fetchGallery(galeryIdTable: number, galeryNameTable: string = 'aircrafts', page: number = 1, limit: number = 10) {
    try {
      const response = await axios.get(this.API_PATH + '/galleries', {
        params: {
          page,
          limit,
          galeryIdTable,
          galeryNameTable
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default GalleryService;
