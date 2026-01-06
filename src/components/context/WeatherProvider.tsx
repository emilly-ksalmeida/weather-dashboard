import { useState } from "react";
import ContextData from "./ContextData";
import type { Location, Geocoding } from "../../utils/types.ts";

interface IWeatherProviderProp {
  children: React.ReactNode;
}

export default function WeatherProvider({ children }: IWeatherProviderProp) {
  const [location, setLocation] = useState<Location>({
    cityName: "Brasília",
    state: "Federal District",
    country: "BR",
  });

  const [coordinates, setCoordinates] = useState<Geocoding>({
    name: "Local escolhido no mapa - Brasília",
    latitude: -15.78,
    longitude: -47.92,
    timeZone: "--",
    state: "Federal District",
    country: "BR",
  });

  const onMapClick = (latitude: number, longitude: number) => {
    setCoordinates({
      name: "Local escolhido no mapa",
      latitude: latitude,
      longitude: longitude,
      timeZone: "--",
      state: "--",
      country: "--",
    });
    setLocation({
      cityName: "Customizado",
      state: "Customizado",
      country: "Customizado",
    });
  };

  return (
    <ContextData.Provider
      value={{ location, setLocation, coordinates, setCoordinates, onMapClick }}
    >
      {children}
    </ContextData.Provider>
  );
}
