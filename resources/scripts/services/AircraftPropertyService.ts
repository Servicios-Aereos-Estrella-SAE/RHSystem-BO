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
    if (aircraftProperty.aircraftPropertiesName) {
      formData.append('aircraftPropertiesName', aircraftProperty.aircraftPropertiesName);
    }
    if (aircraftProperty.aircraftClassId) {
      formData.append('aircraftClassId', aircraftProperty.aircraftClassId.toString());
    }
    if (aircraftProperty.aircraftPropertiesPax !== undefined && aircraftProperty.aircraftPropertiesPax !== null) {
      formData.append('aircraftPropertiesPax', aircraftProperty.aircraftPropertiesPax.toString());
    }
    if (aircraftProperty.aircraftPropertiesSpeed !== undefined && aircraftProperty.aircraftPropertiesSpeed !== null) {
      formData.append('aircraftPropertiesSpeed', aircraftProperty.aircraftPropertiesSpeed.toString());
    }
    if (aircraftProperty.aircraftPropertiesMaxKg !== undefined && aircraftProperty.aircraftPropertiesMaxKg !== null) {
      formData.append('aircraftPropertiesMaxKg', aircraftProperty.aircraftPropertiesMaxKg.toString());
    }
    if (aircraftProperty.aircraftPropertiesAutonomy !== undefined && aircraftProperty.aircraftPropertiesAutonomy !== null) {
      formData.append('aircraftPropertiesAutonomy', aircraftProperty.aircraftPropertiesAutonomy.toString());
    }
    if (aircraftProperty.aircraftPropertiesAutonomyHours !== undefined && aircraftProperty.aircraftPropertiesAutonomyHours !== null) {
      formData.append('aircraftPropertiesAutonomyHours', aircraftProperty.aircraftPropertiesAutonomyHours.toString());
    }
    if (aircraftProperty.aircraftPropertiesHourlyRate !== undefined && aircraftProperty.aircraftPropertiesHourlyRate !== null) {
      formData.append('aircraftPropertiesHourlyRate', aircraftProperty.aircraftPropertiesHourlyRate.toString());
    }
    if (aircraftProperty.aircraftPropertiesLandingCostBase !== undefined && aircraftProperty.aircraftPropertiesLandingCostBase !== null) {
      formData.append('aircraftPropertiesLandingCostBase', aircraftProperty.aircraftPropertiesLandingCostBase.toString());
    }
    if (aircraftProperty.aircraftPropertiesLandingCostNational !== undefined && aircraftProperty.aircraftPropertiesLandingCostNational !== null) {
      formData.append('aircraftPropertiesLandingCostNational', aircraftProperty.aircraftPropertiesLandingCostNational.toString());
    }
    if (aircraftProperty.aircraftPropertiesLandingCostInternational !== undefined && aircraftProperty.aircraftPropertiesLandingCostInternational !== null) {
      formData.append('aircraftPropertiesLandingCostInternational', aircraftProperty.aircraftPropertiesLandingCostInternational.toString());
    }
    if (aircraftProperty.aircraftPropertiesOvernightStayLocal !== undefined && aircraftProperty.aircraftPropertiesOvernightStayLocal !== null) {
      formData.append('aircraftPropertiesOvernightStayLocal', aircraftProperty.aircraftPropertiesOvernightStayLocal.toString());
    }
    if (aircraftProperty.aircraftPropertiesOvernightStayInternational !== undefined && aircraftProperty.aircraftPropertiesOvernightStayInternational !== null) {
      formData.append('aircraftPropertiesOvernightStayInternational', aircraftProperty.aircraftPropertiesOvernightStayInternational.toString());
    }
    if (aircraftProperty.aircraftPropertiesFuelSurcharge !== undefined && aircraftProperty.aircraftPropertiesFuelSurcharge !== null) {
      formData.append('aircraftPropertiesFuelSurcharge', aircraftProperty.aircraftPropertiesFuelSurcharge.toString());
    }
    if (aircraftProperty.aircraftPropertiesDescription) {
      formData.append('aircraftPropertiesDescription', aircraftProperty.aircraftPropertiesDescription);
    }
    if (aircraftProperty.aircraftPropertyBanner) {
      formData.append('aircraftPropertyBanner', aircraftProperty.aircraftPropertyBanner);
    }

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
