import type { Geocoding } from "@/utils/types.ts";
import { getWeatherForecastByCoords } from "../../api/open-meteo.ts";
import { useQuery } from "@tanstack/react-query";

type Props = {
  geocodingResult: Geocoding;
};
export default function Card({ dataForecast }: Props) {
  const { data, isError, error } = useQuery({
    queryKey: ["cityCoords", dataForecast],
    queryFn: () => getWeatherForecastByCoords(dataForecast),
    enabled: !!dataForecast,
  });
  
  if (!data) return <p>Informe uma cidade clicando no mapa</p>;
  if (isError) return <p>Erro: {error.message}</p>;

  return (
    <div>
      <p>Dados da função getweather</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
