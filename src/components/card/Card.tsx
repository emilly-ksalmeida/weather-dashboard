import type { Geocoding } from "@/utils/types.ts";
import { getWeatherForecastByCoords } from "../../api/open-meteo.ts";
import { useQuery } from "@tanstack/react-query";

type Props = {
  geocodingResults: Geocoding;
};
export default function Card({ geocodingResults }: Props) {
  const { data, isError, error } = useQuery({
    queryKey: ["cityCoords", geocodingResults],
    queryFn: () => getWeatherForecastByCoords(geocodingResults),
    enabled: !!geocodingResults,
  });

  if (!data) return <p>Informe uma cidade clicando no mapa</p>;
  if (isError) return <p>Erro: {error.message}</p>;

  return (
    <div className="bg-yellow-300">
      <p>Dados da função getweatherforecast</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
