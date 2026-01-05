import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, Marker, useMap } from "react-leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import "leaflet/dist/leaflet.css";
import { getWeatherForecastByCoords } from "../../api/open-meteo.ts";
import type { Geocoding } from "../../utils/types.ts";

type Props = {
  dataForecast: Geocoding;
  onMapClick: (latitude: number, longitude: number) => void;
};

export default function InteractiveMap({ dataForecast, onMapClick }: Props) {

  return (
    <MapContainer
      key={`${dataForecast.latitude},${dataForecast.longitude}`}
      center={[dataForecast.latitude, dataForecast.longitude]}
      zoom={12}
      style={{ width: "500px", height: "400px" }}
    >
      <MapClick onMapClick={onMapClick} dataForecast={dataForecast} />
      <MapStyle />
      <Marker position={[dataForecast.latitude, dataForecast.longitude]} />
    </MapContainer>
  );
}

function MapClick({
  onMapClick,
  dataForecast,
}: {
  onMapClick: (latitude: number, longitude: number) => void;
  dataForecast: Geocoding;
}) {
  const map = useMap();
  map.panTo([dataForecast.latitude, dataForecast.longitude]);
  map.on("click", e => {
    const { lat: eventLat, lng: eventLng } = e.latlng;
    onMapClick(eventLat, eventLng);
  });
  return null;
}
function MapStyle() {
  const map = useMap();

  useEffect(() => {
    const tileLayer = new MaptilerLayer({
      style: "hybrid",
      apiKey: import.meta.env.VITE_MAPTILER_KEY,
    });
    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map]);
  return null;
}
