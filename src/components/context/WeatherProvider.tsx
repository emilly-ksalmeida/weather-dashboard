import { useState } from "react";
import ContextData from "./ContextData";
import type { Geocoding } from "../../utils/types.ts";

interface IWeatherProviderProp {
  children: React.ReactNode;
}

export default function WeatherProvider({ children }: IWeatherProviderProp) {
  const [coordinates, setCoordinates] = useState<Geocoding>({
    name: "Default Brasília",
    latitude: -15.78,
    longitude: -47.92,
    timeZone: "--",
    state: "Federal District",
    country: "BR",
  });

  return (
    <ContextData.Provider value={{ coordinates, setCoordinates }}>{children}</ContextData.Provider>
  );
}
