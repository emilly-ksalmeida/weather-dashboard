import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { WeatherForecast } from "@/schemas/weatherForecastSchema";
import { formatDate } from "@/utils/dateFormatter";
import { weatherEmojiUnicode } from "@/utils/weatherIcons";

type Props = {
  Forecast: WeatherForecast;
};
export default function DailyCard({ Forecast }: Props) {
  return (
    <div className="flex justify-center">
      <Carousel className="w-full max-w-xs">
        <CarouselPrevious />
        <CarouselContent>
          {Forecast.daily.dailyTime.map((day, index) => (
            <CarouselItem key={day}>
              <div className="p-1">
                <Card className="w-68">
                  <CardHeader>
                    <CardTitle>{formatDate(Forecast.daily.dailyTime[index])}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 justify-center items-center">
                    <p className="text-5xl">
                      {Forecast.daily.weatherCode[index] !== null
                        ? weatherEmojiUnicode[Forecast.daily.weatherCode[index]]
                        : ""}
                    </p>
                    <p className="text-5xl">{Forecast.daily.meanTemperature[index]} °C</p>
                    <div className="flex gap-10">
                      <p className="text-2xl">{Forecast.daily.minTemperature[index]} °C</p>
                      <p className="text-2xl">{Forecast.daily.maxTemperature[index]} °C</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  );
}
