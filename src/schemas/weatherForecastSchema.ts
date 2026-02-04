import { z } from "zod";

const currentSchema = z.object({
  currentTime: z.string(),
  temperature: z.number(),
  relativeHumidity: z.number().int().min(0).max(100),
  isDay: z.number(),
  precipitation: z.number(),
  weatherCode: z.number(),
  windSpeed: z.number(),
});

const hourlySchema = z.object({
  hourlyTime: z.array(z.string()),
  temperature: z.array(z.number()),
  precipitation: z.array(z.number()),
  weatherCode: z.array(z.number()),
});

const dailySchema = z.object({
  dailyTime: z.array(z.string()),
  weatherCode: z.array(z.number()),
  maxTemperature: z.array(z.number()),
  minTemperature: z.array(z.number()),
  meanTemperature: z.array(z.number()),
});

const cityDataGeoShema = z.object({
  timezone: z.string(),
  name: z.string(),
  state: z.string(),
  country: z.string(),
  lat: z.number(),
  long: z.number(),
});

export const weatherForecastByCoordsSchema = z.object({
  current: currentSchema,
  hourly: hourlySchema,
  daily: dailySchema,
  cityDataGeo: cityDataGeoShema,
});

const AirQualityCurrentSchema = z.object({
  time: z.string(),
  usAQI: z.number(),
  pm10: z.number(),
  pm25: z.number(),
});

export const AirQualityForecastSchema = z.object({
  current: AirQualityCurrentSchema,
});

export const ForecastSchema = z.object({
  weather: weatherForecastByCoordsSchema,
  air: AirQualityForecastSchema,
});

export type Forecast = z.infer<typeof ForecastSchema>;
