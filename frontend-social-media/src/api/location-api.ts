// src/api/location-api.ts
import axios from "axios";

// Interface for Country and City Options
export interface CountryOption {
  value: string;
  label: string;
}

export interface CityOption {
  value: string;
  label: string;
}

// Function to fetch all countries
export const fetchCountries = async (): Promise<CountryOption[]> => {
  try {
    const response = await axios.get("https://countriesnow.space/api/v0.1/countries");
    return response.data.data.map((country: any) => ({
      value: country.country,
      label: country.country,
    }));
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw new Error("Failed to fetch countries");
  }
};

// Function to fetch cities for a given country
export const fetchCities = async (country: string): Promise<CityOption[]> => {
  try {
    const response = await axios.get(`https://countriesnow.space/api/v0.1/countries/cities`, {
      params: { country },
    });
    return response.data.data.map((city: string) => ({
      value: city,
      label: city,
    }));
  } catch (error) {
    console.error(`Error fetching cities for ${country}:`, error);
    throw new Error(`Failed to fetch cities for ${country}`);
  }
};
