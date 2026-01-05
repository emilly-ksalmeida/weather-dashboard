import { useState } from "react";
import { skipToken, useQuery } from "@tanstack/react-query";
import LocationPicker from "./components/locationPicker/LocationPicker.tsx";
import InteractiveMap from "./components/map/InteractiveMap.tsx";
import "./index.css";
import { getGeocoding } from "./api/open-meteo.ts";
import type { Location, Geocoding } from "./utils/types.ts";
import Card from "./components/card/Card.tsx";

function App() {
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["geocodingLocation", location],
    queryFn:
      location.cityName === "Customizado" || location.cityName === ""
        ? skipToken
        : () => getGeocoding(location),
    enabled: !!location,
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

  const geocodingResult =
    location.cityName === "Customizado"
      ? coordinates
      : {
          name: data?.name ?? "teste",
          latitude: data?.latitude ?? 0,
          longitude: data?.longitude ?? 0,
          timeZone: data?.timeZone ?? "teste",
          state: data?.state ?? "teste",
          country: data?.country ?? "teste",
        };

  if (isLoading) return <p>Carregando</p>;
  if (isError) return <p>Erro: {error.message}</p>;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-extrabold text-center p-4">Painel Climático</h1>
      <p>Procure uma cidade ou selecione pelo mapa:</p>
      <LocationPicker location={location} setLocation={setLocation} />

      <InteractiveMap geocodingResult={geocodingResult} onMapClick={onMapClick} />

      <Card geocodingResult={geocodingResult} />

      <p className="bg-sky-300 p-4">Resultado</p>
      
      <pre>{JSON.stringify(geocodeData, null, 2)}</pre>
    </div>
  );
}

export default App;
