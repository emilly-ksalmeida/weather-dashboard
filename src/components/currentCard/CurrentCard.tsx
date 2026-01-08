import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { weatherEmojiUnicode } from "../../utils/weatherIcons.ts";
import { formatDateTime } from "../../utils/dateFormatter.ts";
import type { WeatherForecast } from "@/schemas/weatherForecastSchema";

type Props = {
  Forecast: WeatherForecast;
};

export default function CurrentCard({ Forecast }: Props) {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>{Forecast.cityDataGeo.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 justify-center items-center">
        <p className="text-5xl">
          {Forecast.current.weatherCode !== null
            ? weatherEmojiUnicode[Forecast.current.weatherCode]
            : ""}
        </p>
        <p className="text-5xl">{Forecast.current.temperature} °C</p>
        <p>{formatDateTime(Forecast.current.currentTime)}</p>
        <div className="flex flex-row gap-5">
          <span>{Forecast.current.precipitation} mm</span>
          <span>{Forecast.current.relativeHumidity} %</span>
        </div>
        <p className="text-sm">
          {Forecast.cityDataGeo.state} - {Forecast.cityDataGeo.country}
        </p>
      </CardContent>
    </Card>
  );
}
