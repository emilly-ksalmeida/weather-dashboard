import { useSuspenseQuery } from "@tanstack/react-query";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatDateTime } from "@/utils/dateFormatter";
import { weatherEmojiUnicode } from "@/utils/weatherIcons";
import { WiRaindrop } from "react-icons/wi";
import { getWeatherForecastByCoords } from "@/api/open-meteo";
import { useContext } from "react";
import ContextData from "../context/ContextData";


export default function HourlyCards() {
  const context = useContext(ContextData);
  const { coordinates } = context;

  const {
    data: Forecast,
    isError,
    error,
  } = useSuspenseQuery({
    queryKey: ["cityCoords", coordinates],
    queryFn: () => getWeatherForecastByCoords(coordinates),
  });
  if (isError) return <p>Erro: {error.message}</p>;
  return (
    <ScrollArea className="w-full max-w-210 rounded-md border">
      <h2>Previsão do tempo por hora:</h2>
      <div className="flex gap-2 p-4 w-max">
        {Forecast.hourly.hourlyTime.map((day, index) => (
          <Card className="w-46 shrink-0" key={day}>
            <CardHeader>
              <CardTitle>{formatDateTime(day)}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 justify-center items-center">
              <p className="text-3xl">
                {Forecast.current.weatherCode !== null
                  ? weatherEmojiUnicode[Forecast.hourly.weatherCode[index]]
                  : ""}
              </p>
              <p className="text-3xl">{Forecast.hourly.temperature[index]} °C</p>
              <div className="flex flex-row gap-1 items-center">
                <WiRaindrop />
                <p>{Forecast.hourly.precipitation[index]} mm</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
