// GalleryService.ts
import axios from "axios";

class GalleryService {
  protected API_PATH: string;

  constructor() {
    const CONFIG = useRuntimeConfig();
    this.API_PATH = CONFIG.public.BASE_API_PATH;
  }

  public async fetchGallery(
    galeryIdTable: number,
    galeryNameTable: string = "aircrafts",
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const response = await axios.get(this.API_PATH + "/galleries", {
        params: {
          page,
          limit,
          galeryIdTable,
          galeryNameTable,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async fetchCategories() {
    try {
      const response = await axios.get(this.API_PATH + "/galleries");
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteImage(imageId: number) {
    return axios.delete(this.API_PATH + `/galleries/${imageId}`);
  }

  public async uploadImage(formData: FormData) {
    try {
      const response = await axios.post(
        this.API_PATH + "/galleries",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default GalleryService;
