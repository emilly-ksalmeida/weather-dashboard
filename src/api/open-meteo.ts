import { format, addDays, parseISO } from "date-fns";
import {
  weatherForecastByCoordsSchema,
  AirQualityForecastSchema,
} from "../schemas/weatherForecastSchema.ts";
import { GeocodingSchema } from "../schemas/localizationSchema.ts";
import type { Geocoding, Location, FetchGeocoding, Coords } from "../utils/types.ts";
import type { WeatherForecast, AirQualityForecast } from "../schemas/weatherForecastSchema.ts";

function formatToUrlParameter(cityName: string): string {
  const encodedCityName = encodeURIComponent(cityName);
  return encodedCityName;
}

function getDaysRange(): {
  nowDate: string;
  endDate: string;
} {
  const nowDate = format(new Date(), "yyyy-MM-dd");
  const endDate = addDays(parseISO(nowDate), 5);

  return {
    nowDate: nowDate,
    endDate: format(endDate, "yyyy-MM-dd"),
  };
}

export async function getGeocoding(locationSearch: Location): Promise<Geocoding> {
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
    dataGeo =
      data.results
        .filter((result: FetchGeocoding) => result.admin1 === stateSearch)
        .map((citySeleted: FetchGeocoding) => {
          const city = {
            name: citySeleted.name,
            latitude: citySeleted.latitude,
            longitude: citySeleted.longitude,
            timeZone: citySeleted.timezone,
            state: citySeleted.admin1,
            country: citySeleted.country,
          };
          return city;
        })[0] || [];
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
    })[0];
  }
  if (dataGeo.length === 0) {
    throw new Error("Cidade não encontrada no brasil!");
  }
  return GeocodingSchema.parse(dataGeo);
}

export async function getWeatherForecastByCoords(
  dataGeocoding: Geocoding
): Promise<WeatherForecast> {
  const { latitude, longitude, country, name, state } = dataGeocoding;
  const { nowDate, endDate } = getDaysRange();
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum&hourly=temperature_2m,precipitation,weather_code&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto&start_date=${nowDate}&end_date=${endDate}`;
  const resDataForecast = await fetch(url);
  const resDataForecastJSON = await resDataForecast.json();

  const weatherForecastByCoords = {
    current: {
      currentTime: resDataForecastJSON.current.time,
      temperature: Math.round(resDataForecastJSON.current.temperature_2m),
      relativeHumidity: resDataForecastJSON.current.relative_humidity_2m,
      isDay: resDataForecastJSON.current.is_day,
      precipitation: Number(resDataForecastJSON.current.precipitation.toFixed(1)),
      weatherCode: resDataForecastJSON.current.weather_code,
      windSpeed: Math.round(resDataForecastJSON.current.wind_speed_10m),
    },
    hourly: {
      hourlyTime: resDataForecastJSON.hourly.time.slice(0, 24),
      temperature: resDataForecastJSON.hourly.temperature_2m
        .slice(0, 24)
        .map((t: number) => Math.round(t)),
      precipitation: resDataForecastJSON.hourly.precipitation
        .slice(0, 24)
        .map((p: number) => Number(p.toFixed(1))),
      weatherCode: resDataForecastJSON.hourly.weather_code.slice(0, 24),
    },
    daily: {
      dailyTime: resDataForecastJSON.daily.time,
      weatherCode: resDataForecastJSON.daily.weather_code,
      maxTemperature: resDataForecastJSON.daily.temperature_2m_max.map((t: number) =>
        Math.round(t)
      ),
      minTemperature: resDataForecastJSON.daily.temperature_2m_min.map((t: number) =>
        Math.round(t)
      ),
      meanTemperature: resDataForecastJSON.daily.temperature_2m_mean.map((t: number) =>
        Math.round(t)
      ),
      precipitation: resDataForecastJSON.daily.precipitation_sum.map((p: number) => {
        return Number(p.toFixed(1));
      }),
    },
    cityDataGeo: {
      timezone: resDataForecastJSON.timezone,
      name: name,
      state: state,
      country: country,
      lat: resDataForecastJSON.latitude,
      long: resDataForecastJSON.longitude,
    },
  };
  return weatherForecastByCoordsSchema.parse(weatherForecastByCoords);
}

export async function getAirQualityByCoords(coords: Coords): Promise<AirQualityForecast> {
  const { latitude, longitude } = coords;
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?timezone=auto&latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm10,pm2_5&forecast_days=1`;

  const resDataAirCity = await fetch(url);
  const resDataAirCityJson = await resDataAirCity.json();

  const airQualityForecast = {
    current: {
      time: resDataAirCityJson.current.time,
      usAQI: resDataAirCityJson.current.us_aqi,
      pm10: resDataAirCityJson.current.pm10,
      pm25: resDataAirCityJson.current.pm2_5,
    },
  };

  return AirQualityForecastSchema.parse(airQualityForecast);
}
