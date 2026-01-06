import type { Geocoding } from "@/utils/types.ts";
import { useQuery } from "@tanstack/react-query";
import { getAirQualityByCoords } from "../../api/open-meteo.ts";

type Props = {
  geocodingResults: Geocoding;
};
export default function AirQuality({ geocodingResults }: Props) {
  const { data, isError, error } = useQuery({
    queryKey: ["airQuality", geocodingResults.latitude, geocodingResults.longitude],
    queryFn: () =>
      getAirQualityByCoords({
        latitude: geocodingResults.latitude,
        longitude: geocodingResults.longitude,
      }),
    enabled: !!geocodingResults,
  });

  if (!data) return <p>Informe uma cidade</p>;
  if (isError) return <p>Erro: {error.message}</p>;

  return (
    <div className="bg-orange-300">
      <p>Dados da função getAirQualityforecast</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
