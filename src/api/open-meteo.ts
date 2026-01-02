import type { Geocoding, Location, FetchGeocoding } from "../utils/types.ts";

function formatToUrlParameter(cityName: string): string {
  const encodedCityName = encodeURIComponent(cityName);
  return encodedCityName;
}

export async function getGeocoding(locationSearch: Location): Promise<Geocoding[]> {
  const cityName = locationSearch.cityName;
  const countryCode = locationSearch.country;
  const stateSearch = locationSearch.state;
  const encodedCityName = formatToUrlParameter(cityName);
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCityName}&count=10&language=en&format=json&countryCode=${countryCode}`
  );
  const data = await response.json();

  if (!data.results) {
    throw new Error("Cidade não encontrada!");
  }

  let dataGeo;

  if (countryCode === "BR") {
    dataGeo = data.results.filter((result: FetchGeocoding) => result.admin1 === stateSearch);
  } else {
    dataGeo = data.results.map((result: FetchGeocoding) => {
      const city = {
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        timeZone: result.timezone,
        state: result.admin1,
        country: result.country,
      };
      return city;
    });
  }
  if (dataGeo.length === 0) {
    throw new Error("Cidade não encontrada no brasil!");
  }
  return dataGeo;
}
