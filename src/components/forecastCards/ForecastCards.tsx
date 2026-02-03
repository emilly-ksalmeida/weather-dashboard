import { Suspense, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import ContextData from "../context/ContextData.ts";
import { getWeatherForecastByCoords } from "../../api/open-meteo.ts";
import { Separator } from "@radix-ui/react-separator";
import CurrentCard from "../currentCard/CurrentCard.tsx";
import AirQuality from "../airQuality/AirQuality.tsx";
import HourlyCards from "../hourlyCards/HourlyCards.tsx";
import DailyCard from "../dailyCard/DailyCard.tsx";
import CurrentCardSkeleton from "../skeletons/CurrentCardSkeleton.tsx";
import HourlyCardsSkeleton from "../skeletons/HourlyCardsSkeleton.tsx";
import DailyCardsSkeleton from "../skeletons/DailyCardsSkeleton.tsx";

export default function ForecastCards() {
  const context = useContext(ContextData);
  const { coordinates } = context;
  const {
    data: Forecast,
    isError,
    error,
  } = useQuery({
    queryKey: ["cityCoords", coordinates],
    queryFn: () => getWeatherForecastByCoords(coordinates),
    enabled: !!coordinates,
  });

  if (isError) return <p>Erro: {error.message}</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-wrap justify-center gap-10">
        <Suspense fallback={<CurrentCardSkeleton />}>
          <CurrentCard />
        </Suspense>

        {/* <AirQuality geocodingResults={geocodingResults} /> */}
      </div>

      <Separator className="my-2" />
      <Suspense fallback={<HourlyCardsSkeleton />}>
        <HourlyCards />
      </Suspense>

      <Separator className="my-2" />
      <Suspense fallback={<DailyCardsSkeleton />}>
        <DailyCard />
      </Suspense>
    </div>
  );
}
