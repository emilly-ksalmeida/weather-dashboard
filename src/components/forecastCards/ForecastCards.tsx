import { skipToken, useQuery } from "@tanstack/react-query";
import { getWeatherForecastByCoords } from "../../api/open-meteo.ts";
import { Separator } from "@radix-ui/react-separator";
import CurrentCard from "../currentCard/CurrentCard.tsx";
import AirQuality from "../airQuality/AirQuality.tsx";
import HourlyCards from "../hourlyCards/HourlyCards.tsx";
import DailyCard from "../dailyCard/DailyCard.tsx";
import type { Geocoding } from "@/utils/types.ts";

import { Suspense } from "react";
import CurrentCardSkeleton from "../skeletons/CurrentCardSkeleton.tsx";

import HourlyCardsSkeleton from "../skeletons/HourlyCardsSkeleton.tsx";
import DailyCardsSkeleton from "../skeletons/DailyCardsSkeleton.tsx";

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
    queryFn:
      geocodingResults.name === "teste"
        ? skipToken
        : () => getWeatherForecastByCoords(geocodingResults),
    enabled: !!geocodingResults,
  });

  if (isError) return <p>Erro: {error.message}</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-wrap justify-center gap-10">
        <Suspense fallback={<CurrentCardSkeleton />}>
          <CurrentCard geocodingResults={geocodingResults} />
        </Suspense>

        <AirQuality geocodingResults={geocodingResults} />
      </div>

      <Separator className="my-2" />
      <Suspense fallback={<HourlyCardsSkeleton />}>
        <HourlyCards geocodingResults={geocodingResults} />
      </Suspense>

      <Separator className="my-2" />
      <Suspense fallback={<DailyCardsSkeleton />}>
        <DailyCard geocodingResults={geocodingResults} />
      </Suspense>
    </div>
  );
}
