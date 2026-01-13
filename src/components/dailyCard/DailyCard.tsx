import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatDate } from "@/utils/dateFormatter";
import { weatherEmojiUnicode } from "@/utils/weatherIcons";
import { WiThermometer } from "react-icons/wi";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { getWeatherForecastByCoords } from "@/api/open-meteo";

type Props = {
  geocodingResults: Geocoding;
};

export default function DailyCard({ geocodingResults }: Props) {
  const {
    data: Forecast,
    isError,
    error,
  } = useSuspenseQuery({
    queryKey: ["cityCoords", geocodingResults],
    queryFn: () => getWeatherForecastByCoords(geocodingResults),
  });
  if (isError) return <p>Erro: {error.message}</p>;
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
                  <CardContent className="flex flex-col gap-8 justify-center items-center">
                    <p className="text-[55px]">
                      {Forecast.daily.weatherCode[index] !== null
                        ? weatherEmojiUnicode[Forecast.daily.weatherCode[index]]
                        : ""}
                    </p>
                    <div className="flex flex-row items-end">
                      <WiThermometer size={30} />
                      <p className="text-5xl">{Forecast.daily.meanTemperature[index]} °C</p>
                    </div>

                    <div className="flex gap-10">
                      <div className="flex">
                        <IoIosArrowRoundDown size={20} />
                        <p className="text-2xl">{Forecast.daily.minTemperature[index]} °C</p>
                      </div>
                      <div className="flex">
                        <IoIosArrowRoundUp size={20} />
                        <p className="text-2xl">{Forecast.daily.maxTemperature[index]} °C</p>
                      </div>
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
