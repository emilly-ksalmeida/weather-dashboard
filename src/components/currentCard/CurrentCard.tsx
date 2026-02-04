import { useContext } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import ContextData from "../context/ContextData.ts";
import { getForecast } from "@/api/open-meteo.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { weatherEmojiUnicode } from "../../assets/weatherIcons.ts";
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
    queryFn: () => getForecast(coordinates),
  });
  if (isError) return <p>Erro: {error.message}</p>;
  return (
    <Card className="w-74">
      <CardHeader>
        <CardTitle>
          {Forecast.weather.cityDataGeo.name === "Local escolhido no mapa" ? (
            <p>
              {`Coordenadas latitude: ${Forecast.weather.cityDataGeo.lat}, longitude: ${Forecast.weather.cityDataGeo.long}`}
            </p>
          ) : (
            Forecast.weather.cityDataGeo.name
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 justify-center items-center">
        <p className="text-5xl">
          {Forecast.weather.current.weatherCode !== null
            ? weatherEmojiUnicode[Forecast.weather.current.weatherCode]
            : ""}
        </p>
        <div className="flex flex-row items-end">
          <WiThermometer size={30} />
          <p className="text-5xl">{Forecast.weather.current.temperature} °C</p>
        </div>
        <p>{formatDateTime(Forecast.weather.current.currentTime)}</p>
        <div className="flex flex-row gap-5">
          <div className="flex flex-row gap-1 items-center">
            <WiRaindrop />
            <span>{Forecast.weather.current.precipitation} mm</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <WiHumidity />
            <span>{Forecast.weather.current.relativeHumidity} %</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <WiStrongWind />
            <span>{Forecast.weather.current.windSpeed} km/h</span>
          </div>
        </div>
        <p className="text-sm">
          {Forecast.weather.cityDataGeo.state} - {Forecast.weather.cityDataGeo.country}
        </p>
      </CardContent>
    </Card>
  );
}
