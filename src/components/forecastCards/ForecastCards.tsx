import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAirQualityByCoords, getWeatherForecastByCoords } from "../../api/open-meteo.ts";
import { Separator } from "@radix-ui/react-separator";
import CurrentCard from "../currentCard/CurrentCard.tsx";
import AirQuality from "../airQuality/AirQuality.tsx";
import HourlyCards from "../hourlyCards/HourlyCards.tsx";
import DailyCard from "../dailyCard/DailyCard.tsx";
import CurrentCardSkeleton from "../skeletons/CurrentCardSkeleton.tsx";
import HourlyCardsSkeleton from "../skeletons/HourlyCardsSkeleton.tsx";
import DailyCardsSkeleton from "../skeletons/DailyCardsSkeleton.tsx";
import type { Geocoding } from "@/utils/types.ts";


type Props = {
  geoData: Geocoding;
  coordinates: Geocoding | null;
};

export default function ForecastCards({ geoData, coordinates }: Props) {
  const coordsSearch = coordinates?.name === "Local escolhido no mapa" ? coordinates : geoData;

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
        <Suspense fallback={<CurrentCardSkeleton />}>
          <CurrentCard coordsSearch={coordsSearch} />
        </Suspense>

        <AirQuality coordsSearch={coordsSearch} />
      </div>

      <Separator className="my-2" />

      <Suspense fallback={<HourlyCardsSkeleton />}>
        <HourlyCards coordsSearch={coordsSearch} />
      </Suspense>

      <Separator className="my-2" />
      <Suspense fallback={<DailyCardsSkeleton />}>
        <DailyCard coordsSearch={coordsSearch} />
      </Suspense>
    </div>
  );
}
