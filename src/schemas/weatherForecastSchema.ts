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
  precipitation: z.array(z.number()),
});

const cityDataGeoShema = z.object({
  timezone: z.string(),
  name: z.string(),
  state: z.string(),
  country: z.string(),
});

export const weatherForecastByCoordsSchema = z.object({
  current: currentSchema,
  hourly: hourlySchema,
  daily: dailySchema,
  cityDataGeo: cityDataGeoShema,
});

export type WeatherForecast = z.infer<typeof weatherForecastByCoordsSchema>;
