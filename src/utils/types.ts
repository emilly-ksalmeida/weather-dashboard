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
  name: string | null;
  latitude: number | null;
  longitude: number | null;
  timeZone: string | null;
  state: string | null;
  country: string | null;
};

export type Coords = {
  latitude: number | null;
  longitude: number | null;
};

export type Location = {
  cityName: string;
  state?: string;
  country: string;
};
