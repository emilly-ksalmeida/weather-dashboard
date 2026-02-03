import { useContext } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import ContextData from "../context/ContextData.ts";
import { getWeatherForecastByCoords } from "@/api/open-meteo.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { weatherEmojiUnicode } from "../../utils/weatherIcons.ts";
import { formatDateTime } from "../../utils/dateFormatter.ts";
import { WiStrongWind, WiRaindrop, WiHumidity, WiThermometer } from "react-icons/wi";

export default function CurrentCard() {
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
    <Card className="w-74">
      <CardHeader>
        <CardTitle>
          {Forecast.cityDataGeo.name === "Local escolhido no mapa"
            ? `latitude: ${Forecast.cityDataGeo.lat} latitude: ${Forecast.cityDataGeo.long}`
            : Forecast.cityDataGeo.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 justify-center items-center">
        <p className="text-5xl">
          {Forecast.current.weatherCode !== null
            ? weatherEmojiUnicode[Forecast.current.weatherCode]
            : ""}
        </p>
        <div className="flex flex-row items-end">
          <WiThermometer size={30} />
          <p className="text-5xl">{Forecast.current.temperature} °C</p>
        </div>
        <p>{formatDateTime(Forecast.current.currentTime)}</p>
        <div className="flex flex-row gap-5">
          <div className="flex flex-row gap-1 items-center">
            <WiRaindrop />
            <span>{Forecast.current.precipitation} mm</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <WiHumidity />
            <span>{Forecast.current.relativeHumidity} %</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <WiStrongWind />
            <span>{Forecast.current.windSpeed} km/h</span>
          </div>
        </div>
        <p className="text-sm">
          {Forecast.cityDataGeo.state} - {Forecast.cityDataGeo.country}
        </p>
      </CardContent>
    </Card>
  );
}
