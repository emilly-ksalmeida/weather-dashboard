import { Suspense } from "react";
import { skipToken, useQuery } from "@tanstack/react-query";
import AirQualitySkeleton from "../skeletons/AirQualitySkeleton.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAirQualityByCoords } from "../../api/open-meteo.ts";
import type { Geocoding } from "@/utils/types.ts";

type Props = {
  geocodingResults: Geocoding;
};
export default function AirQuality({ geocodingResults }: Props) {
  const {
    data: air,
    isError,
    error,
  } = useQuery({
    queryKey: ["airQuality", geocodingResults.latitude, geocodingResults.longitude],
    queryFn:
      geocodingResults.name === "teste"
        ? skipToken
        : () =>
            getAirQualityByCoords({
              latitude: geocodingResults.latitude,
              longitude: geocodingResults.longitude,
            }),
    enabled: !!geocodingResults,
  });

  if (isError) return <p>Erro: {error.message}</p>;

  return (
    <Suspense fallback={<AirQualitySkeleton />}>
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Qualidade do ar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <p>AQI: {air?.current.usAQI}</p>
            <p>PM 10: {air?.current.pm10}</p>
            <p>PM 2,5: {air?.current.pm25}</p>
          </div>
          <p>referencia dos dados, faixas</p>
        </CardContent>
      </Card>
    </Suspense>
  );
}
