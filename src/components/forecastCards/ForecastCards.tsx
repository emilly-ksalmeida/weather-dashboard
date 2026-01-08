import { useQuery } from "@tanstack/react-query";
import { getWeatherForecastByCoords } from "../../api/open-meteo.ts";
import { Separator } from "@radix-ui/react-separator";
import CurrentCard from "../currentCard/CurrentCard.tsx";
import AirQuality from "../airQuality/AirQuality.tsx";
import HourlyCards from "../hourlyCards/HourlyCards.tsx";
import DailyCard from "../dailyCard/DailyCard.tsx";
import type { Geocoding } from "@/utils/types.ts";

type Props = {
  geocodingResults: Geocoding;
};
export default function ForecastCards({ geocodingResults }: Props) {
  const {
    data: Forecast,
    isError,
    error,
  } = useQuery({
    queryKey: ["cityCoords", geocodingResults],
    queryFn: () => getWeatherForecastByCoords(geocodingResults),
    enabled: !!geocodingResults,
  });

  if (!Forecast) return <p>Informe uma cidade clicando no mapa</p>;
  if (isError) return <p>Erro: {error.message}</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-wrap justify-center gap-10">
        <CurrentCard Forecast={Forecast} />
        <AirQuality geocodingResults={geocodingResults} />
      </div>

      <Separator className="my-2" />

      <HourlyCards Forecast={Forecast} />

      <Separator className="my-2" />

      <DailyCard Forecast={Forecast} />
    </div>
  );
}
