import { format, addDays, parseISO } from "date-fns";
import { ForecastSchema } from "../schemas/weatherForecastSchema.ts";
import { GeocodingSchema } from "../schemas/localizationSchema.ts";
import type { Geocoding, Location, FetchGeocoding } from "../utils/types.ts";
import type { Forecast } from "../schemas/weatherForecastSchema.ts";

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
    dataGeo = data.results
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
      })[0];
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

export async function getForecast(dataGeocoding: Geocoding): Promise<Forecast> {
  const { latitude, longitude, country, name, state } = dataGeocoding;
  const { nowDate, endDate } = getDaysRange();

  if (dataGeocoding.name === "Default Brasília") {
    return {
      weather: {
        current: {
          currentTime: "2026-02-03T18:30",
          temperature: 26.2,
          relativeHumidity: 55,
          isDay: 1,
          precipitation: 0.0,
          weatherCode: 2,
          windSpeed: 10.8,
        },
        hourly: {
          hourlyTime: ["2026-02-03T18:00", "2026-02-03T19:00", "2026-02-03T20:00"],
          temperature: [26.2, 24.5, 23.1],
          precipitation: [0.0, 0.0, 0.0],
          weatherCode: [2, 2, 1],
        },
        daily: {
          dailyTime: ["2026-02-03", "2026-02-04", "2026-02-05"],
          weatherCode: [2, 3, 3],
          maxTemperature: [28.5, 27.8, 27.2],
          minTemperature: [17.5, 18.0, 18.2],
          meanTemperature: [23.0, 22.9, 22.7],
        },
        cityDataGeo: {
          timezone: "America/Sao_Paulo",
          name: "Brasília",
          state: "Federal District",
          country: "Brazil",
          lat: -15.7801,
          long: -47.9292,
        },
      },
      air: {
        current: {
          time: "2026-02-03T18:30",
          usAQI: 1,
          pm10: 1,
          pm25: 1,
        },
      },
    };
  } else {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum&hourly=temperature_2m,precipitation,weather_code&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto&start_date=${nowDate}&end_date=${endDate}`;

    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?timezone=auto&latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm10,pm2_5&forecast_days=1`;

    const [resDataWeatherForecast, resDataAirQuality] = await Promise.all([
      fetch(weatherUrl),
      fetch(airUrl),
    ]);
    const resDataWeatherForecastJSON = await resDataWeatherForecast.json();
    const resDataAirQualityJSON = await resDataAirQuality.json();

    const forecast = {
      weather: {
        current: {
          currentTime: resDataWeatherForecastJSON.current.time,
          temperature: Math.round(resDataWeatherForecastJSON.current.temperature_2m),
          relativeHumidity: resDataWeatherForecastJSON.current.relative_humidity_2m,
          isDay: resDataWeatherForecastJSON.current.is_day,
          precipitation: Number(resDataWeatherForecastJSON.current.precipitation.toFixed(1)),
          weatherCode: resDataWeatherForecastJSON.current.weather_code,
          windSpeed: Math.round(resDataWeatherForecastJSON.current.wind_speed_10m),
        },
        hourly: {
          hourlyTime: resDataWeatherForecastJSON.hourly.time.slice(0, 24),
          temperature: resDataWeatherForecastJSON.hourly.temperature_2m
            .slice(0, 24)
            .map((t: number) => Math.round(t)),
          precipitation: resDataWeatherForecastJSON.hourly.precipitation
            .slice(0, 24)
            .map((p: number) => Number(p.toFixed(1))),
          weatherCode: resDataWeatherForecastJSON.hourly.weather_code.slice(0, 24),
        },
        daily: {
          dailyTime: resDataWeatherForecastJSON.daily.time,
          weatherCode: resDataWeatherForecastJSON.daily.weather_code,
          maxTemperature: resDataWeatherForecastJSON.daily.temperature_2m_max.map((t: number) =>
            Math.round(t)
          ),
          minTemperature: resDataWeatherForecastJSON.daily.temperature_2m_min.map((t: number) =>
            Math.round(t)
          ),
          meanTemperature: resDataWeatherForecastJSON.daily.temperature_2m_mean.map((t: number) =>
            Math.round(t)
          ),
          precipitation: resDataWeatherForecastJSON.daily.precipitation_sum.map((p: number) => {
            return Number(p.toFixed(1));
          }),
        },
        cityDataGeo: {
          timezone: resDataWeatherForecastJSON.timezone,
          name: name,
          state: state,
          country: country,
          lat: resDataWeatherForecastJSON.latitude,
          long: resDataWeatherForecastJSON.longitude,
        },
      },
      air: {
        current: {
          time: resDataAirQualityJSON.current.time,
          usAQI: resDataAirQualityJSON.current.us_aqi,
          pm10: resDataAirQualityJSON.current.pm10,
          pm25: resDataAirQualityJSON.current.pm2_5,
        },
      },
    };

    return ForecastSchema.parse(forecast);
  }
}
