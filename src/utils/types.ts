export interface FetchGeocoding {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id: number;
  timezone: string;
  population: number;
  country_id: number;
  country: string;
  admin1: string;
  admin2: string;
}

export interface ApiResponseGeocoding {
  results: FetchGeocoding[];
  generationtime_ms: number;
}

export type Geocoding = {
  name: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  state: string;
  country: string;
};

export type Coords = {
  latitude: number;
  longitude: number;
};

export type Location = {
  cityName: string;
  state?: string;
  country: string;
};
