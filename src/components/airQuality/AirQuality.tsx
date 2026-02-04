import { useContext } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import ContextData from "../context/ContextData.ts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getForecast } from "../../api/open-meteo.ts";

export default function AirQuality() {
  const context = useContext(ContextData);
  const { coordinates } = context;

  const {
    data: Forecast,
    isError,
    error,
  } = useSuspenseQuery({
    queryKey: ["cityCoords", coordinates],
    queryFn: () => getForecast(coordinates),
  });

  if (isError) return <p>Erro: {error.message}</p>;

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Qualidade do ar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <p>AQI: {Forecast.air.current.usAQI}</p>
          <p>PM 10: {Forecast.air.current.pm10}</p>
          <p>PM 2,5: {Forecast.air.current.pm25}</p>
        </div>
        <p>referencia dos dados, faixas</p>
      </CardContent>
    </Card>
  );
}
