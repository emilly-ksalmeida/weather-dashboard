import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LocationPicker from "./components/locationPicker/LocationPicker.tsx";
import "./index.css";
import { getGeocoding } from "./api/open-meteo.ts";
import type { Location } from "./utils/types.ts";

function App() {
  const [location, setLocation] = useState<Location>({
    cityName: "Brasília",
    state: "Federal District",
    country: "BR",
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["geocodingLocation", location],
    queryFn: () => getGeocoding(location),
    enabled: !!location,
  });
  if (isLoading) return <p>Carregando</p>;
  if (isError) return <p>Erro: {error.message}</p>;
  return (
    <>
      <h1 className="text-3xl font-extrabold text-center p-4">Painel Climático</h1>
      <p>Procure uma cidade ou selecione pelo mapa:</p>
      <LocationPicker location={location} setLocation={setLocation} />
      <p className="bg-sky-300 p-4">Resultado</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export default App;
