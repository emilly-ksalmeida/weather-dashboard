import { Suspense, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import ContextData from "../context/ContextData.ts";
import { getAirQualityByCoords, getWeatherForecastByCoords } from "../../api/open-meteo.ts";
import { Separator } from "@radix-ui/react-separator";
import CurrentCard from "../currentCard/CurrentCard.tsx";
import AirQuality from "../airQuality/AirQuality.tsx";
import HourlyCards from "../hourlyCards/HourlyCards.tsx";
import DailyCard from "../dailyCard/DailyCard.tsx";

// import CurrentCardSkeleton from "../skeletons/CurrentCardSkeleton.tsx";
// import HourlyCardsSkeleton from "../skeletons/HourlyCardsSkeleton.tsx";
// import DailyCardsSkeleton from "../skeletons/DailyCardsSkeleton.tsx";
import type { Geocoding } from "@/utils/types.ts";

type Props = {
  geoData: Geocoding;
};

export default function ForecastCards({ geoData }: Props) {
  const context = useContext(ContextData);
  const { coordinates } = context;

  const coordsSearch = coordinates.name === "Local escolhido no mapa" ? coordinates : geoData;

  const {
    data: Forecast,
    isError,
    error,
  } = useQuery({
    queryKey: ["cityCoords", coordsSearch],
    queryFn: () => getWeatherForecastByCoords(coordsSearch),
    enabled: !!coordsSearch,
  });

  const { data: air } = useQuery({
    queryKey: ["airQuality", coordsSearch],
    queryFn: () =>
      getAirQualityByCoords({
        latitude: coordsSearch.latitude,
        longitude: coordsSearch.longitude,
      }),
    enabled: !!coordsSearch,
  });

  if (isError) return <p>Erro: {error.message}</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-wrap justify-center gap-10">
        <CurrentCard coordsSearch={coordsSearch} />

        <AirQuality coordsSearch={coordsSearch} />
      </div>

      <Separator className="my-2" />

      <HourlyCards coordsSearch={coordsSearch} />

      <Separator className="my-2" />

      <DailyCard coordsSearch={coordsSearch} />
    </div>
  );
}
