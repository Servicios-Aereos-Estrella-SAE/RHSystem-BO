// GalleryService.ts
import axios from "axios";
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

class GalleryService {
  protected API_PATH: string;
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig();
    this.API_PATH = CONFIG.public.BASE_API_PATH;
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  public async updateImage(imageId: number, formData: FormData) {
    const headers = { ...this.GENERAL_HEADERS }
    const response = await fetch(this.API_PATH+`/galleries/${imageId}`, {
      headers,
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error updating the image');
    }

    return await response.json();
  }

  public async fetchGallery(
    galeryIdTable: number,
    galeryNameTable: string = "aircrafts",
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const headers = { ...this.GENERAL_HEADERS }

      const response = await axios.get(this.API_PATH + "/galleries", {
        headers,
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
      const headers = { ...this.GENERAL_HEADERS }

      const response = await axios.get(this.API_PATH + "/galleries");
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteImage(imageId: number) {
    const headers = { ...this.GENERAL_HEADERS }

    return axios.delete(this.API_PATH + `/galleries/${imageId}`);
  }

  public async uploadImage(formData: FormData) {
    try {
      const headers = { ...this.GENERAL_HEADERS }
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
