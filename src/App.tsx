import { useContext } from "react";
import { skipToken, useQuery } from "@tanstack/react-query";
import ContextData from "./components/context/ContextData.ts";
import { Separator } from "@/components/ui/separator";
import LocationPicker from "./components/locationPicker/LocationPicker.tsx";
import InteractiveMap from "./components/map/InteractiveMap.tsx";
import ForecastCards from "./components/forecastCards/ForecastCards.tsx";
import { getGeocoding } from "./api/open-meteo.ts";

function App() {
  const context = useContext(ContextData);
  const { location, coordinates } = context;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["geocodingLocation", location],
    queryFn:
      location.cityName === "Customizado" || location.cityName === ""
        ? skipToken
        : () => getGeocoding(location),
    enabled: !!location,
  });
  const geocodingResults =
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
    <div className="flex flex-col gap-2 px-10 py-12">
      <h1 className="text-3xl font-extrabold text-center p-4">Painel Climático</h1>
      <p>Procure uma cidade abaixo ou selecione pelo mapa:</p>
      <div className="flex flex-wrap justify-center gap-10">
        <LocationPicker />
        <InteractiveMap geocodingResults={geocodingResults} />
      </div>

      <Separator className="my-2" />

      <ForecastCards geocodingResults={geocodingResults} />
    </div>
  );
}

export default App;
