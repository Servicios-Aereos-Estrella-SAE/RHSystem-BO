import type { AircraftPropertyInterface } from "../interfaces/AircraftPropertyInterface";

export default class AircraftPropertyService {
  protected API_PATH: string;

  constructor() {
    const CONFIG = useRuntimeConfig();
    this.API_PATH = CONFIG.public.BASE_API_PATH;
  }

  async getFilteredList(searchText: string, page: number = 1, limit: number = 10) {
    let responseRequest: any = null;

    await $fetch(`${this.API_PATH}/aircraft-properties`, {
      query: {
        searchText,  
        page,
        limit
      },
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      }
    });

    if (responseRequest?.data) {
      return {
        data: responseRequest.data.data,
        meta: responseRequest.data.meta
      };
    }

    return responseRequest;
  }

  async delete(aircraftProperty: AircraftPropertyInterface) {
    let responseRequest: any = null;

    await $fetch(`${this.API_PATH}/aircraft-properties/${aircraftProperty.aircraftPropertiesId}`, {
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });

    return responseRequest;
  }

  async create(aircraftProperty: AircraftPropertyInterface) {
    console.log("created");
    let responseRequest: any = null;
    const formData = new FormData();

    formData.append('aircraftPropertiesName', aircraftProperty.aircraftPropertiesName);
    formData.append('aircraftClassId', aircraftProperty.aircraftClassId?.toString() || '');
    formData.append('aircraftPropertiesPax', aircraftProperty.aircraftPropertiesPax.toString());
    formData.append('aircraftPropertiesSpeed', aircraftProperty.aircraftPropertiesSpeed.toString());
    formData.append('aircraftPropertiesMaxKg', aircraftProperty.aircraftPropertiesMaxKg.toString());
    formData.append('aircraftPropertiesAutonomy', aircraftProperty.aircraftPropertiesAutonomy.toString());
    formData.append('aircraftPropertiesAutonomyHours', aircraftProperty.aircraftPropertiesAutonomyHours.toString());
    if (aircraftProperty.aircraftPropertiesHourlyRate){
      formData.append('aircraftPropertiesHourlyRate', aircraftProperty.aircraftPropertiesHourlyRate.toString());
    }
    if(aircraftProperty.aircraftPropertiesLandingCostBase){
      formData.append('aircraftPropertiesLandingCostBase', aircraftProperty.aircraftPropertiesLandingCostBase.toString());
    }
    formData.append('aircraftPropertiesLandingCostNational', aircraftProperty.aircraftPropertiesLandingCostNational.toString());
    if(aircraftProperty.aircraftPropertiesLandingCostInternational){
      formData.append('aircraftPropertiesLandingCostInternational', aircraftProperty.aircraftPropertiesLandingCostInternational.toString());
    }
    if(aircraftProperty.aircraftPropertiesOvernightStayLocal){
      formData.append('aircraftPropertiesOvernightStayLocal', aircraftProperty.aircraftPropertiesOvernightStayLocal.toString());
    }
    formData.append('aircraftPropertiesOvernightStayInternational', aircraftProperty.aircraftPropertiesOvernightStayInternational.toString());
    if(aircraftProperty.aircraftPropertiesFuelSurcharge){
      formData.append('aircraftPropertiesFuelSurcharge', aircraftProperty.aircraftPropertiesFuelSurcharge.toString());
    }
    if(aircraftProperty.aircraftPropertiesDescription){
      formData.append('aircraftPropertiesDescription', aircraftProperty.aircraftPropertiesDescription.toString());
    }

    if (aircraftProperty.aircraftPropertyBanner) {
      formData.append('aircraftPropertyBanner', aircraftProperty.aircraftPropertyBanner);
    }
    await $fetch(`${this.API_PATH}/aircraft-properties`, {
      method: 'POST',
      body: formData,
      headers: {
      },
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });
    console.log(responseRequest)
    return responseRequest;
  }

  async update(aircraftProperty: AircraftPropertyInterface) {
    let responseRequest: any = null;
    const formData = new FormData();
    console.log("ebntre aqui");
    formData.append('aircraftPropertiesName', aircraftProperty.aircraftPropertiesName);
    formData.append('aircraftClassId', aircraftProperty.aircraftClassId?.toString() || '');
    formData.append('aircraftPropertiesPax', aircraftProperty.aircraftPropertiesPax.toString());
    formData.append('aircraftPropertiesSpeed', aircraftProperty.aircraftPropertiesSpeed.toString());
    formData.append('aircraftPropertiesMaxKg', aircraftProperty.aircraftPropertiesMaxKg.toString());
    formData.append('aircraftPropertiesAutonomy', aircraftProperty.aircraftPropertiesAutonomy.toString());
    formData.append('aircraftPropertiesAutonomyHours', aircraftProperty.aircraftPropertiesAutonomyHours.toString());
    formData.append('aircraftPropertiesHourlyRate', aircraftProperty.aircraftPropertiesHourlyRate.toString());
    formData.append('aircraftPropertiesLandingCostBase', aircraftProperty.aircraftPropertiesLandingCostBase.toString());
    formData.append('aircraftPropertiesLandingCostNational', aircraftProperty.aircraftPropertiesLandingCostNational.toString());
    formData.append('aircraftPropertiesLandingCostInternational', aircraftProperty.aircraftPropertiesLandingCostInternational.toString());
    formData.append('aircraftPropertiesOvernightStayLocal', aircraftProperty.aircraftPropertiesOvernightStayLocal.toString());
    formData.append('aircraftPropertiesOvernightStayInternational', aircraftProperty.aircraftPropertiesOvernightStayInternational.toString());
    formData.append('aircraftPropertiesFuelSurcharge', aircraftProperty.aircraftPropertiesFuelSurcharge.toString());
    formData.append('aircraftPropertiesDescription', aircraftProperty.aircraftPropertiesDescription.toString());
    
    formData.append('aircraftPropertyBanner', aircraftProperty.aircraftPropertyBanner);

    await $fetch(`${this.API_PATH}/aircraft-properties/${aircraftProperty.aircraftPropertiesId}`, {
      method: 'PUT',
      body: formData,
      headers: {
      },
      onResponse({ response }) { responseRequest = response; },
      onRequestError({ response }) { responseRequest = response; }
    });

    return responseRequest;
  }
}
