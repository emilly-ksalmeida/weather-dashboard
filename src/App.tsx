import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import LocationPicker from "./components/locationPicker/LocationPicker.tsx";
import InteractiveMap from "./components/map/InteractiveMap.tsx";
import ForecastCards from "./components/forecastCards/ForecastCards.tsx";
import type { Geocoding, Location } from "@/utils/types.ts";
import { getGeocoding } from "./api/open-meteo.ts";
import { useQuery } from "@tanstack/react-query";

const defaultGeoData: Geocoding = {
  name: "InitialData - Brasília",
  latitude: -15.78,
  longitude: -47.92,
  timeZone: "--",
  state: "Federal District",
  country: "BR",
};

function App() {
  const [location, setLocation] = useState<Location>({
    cityName: "Brasília",
    state: "Federal District",
    country: "BR",
  });
  const {
    data: geoData,
    isError,
    error,
  } = useQuery({
    queryKey: ["geocodingLocation", location],
    queryFn: () => getGeocoding(location),
    initialData: defaultGeoData,
    enabled: !!location,
  });

  return (
    <div className="flex flex-col gap-2 px-10 py-12">
      <h1 className="text-3xl font-extrabold text-center p-4">Painel Climático</h1>
      <p>Procure uma cidade abaixo ou selecione pelo mapa:</p>
      <div className="flex flex-wrap justify-center gap-10">
        <LocationPicker setLocation={setLocation} />

        <InteractiveMap />
      </div>

      <Separator className="my-2" />

      <ForecastCards geoData={geoData} />
    </div>
  );
}

export default App;
