import { useEffect } from "react";
import { MapContainer, Marker, useMap } from "react-leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import "leaflet/dist/leaflet.css";
import type { Geocoding } from "../../utils/types.ts";

type Props = {
  geocodingResult: Geocoding;
  onMapClick: (latitude: number, longitude: number) => void;
};

export default function InteractiveMap({ geocodingResult, onMapClick }: Props) {
  return (
    <MapContainer
      key={`${geocodingResult.latitude},${geocodingResult.longitude}`}
      center={[geocodingResult.latitude, geocodingResult.longitude]}
      zoom={12}
      style={{ width: "500px", height: "400px" }}
    >
      <MapClick onMapClick={onMapClick} geocodingResult={geocodingResult} />
      <MapStyle />
      <Marker position={[geocodingResult.latitude, geocodingResult.longitude]} />
    </MapContainer>
  );
}

function MapClick({
  onMapClick,
  geocodingResult,
}: {
  onMapClick: (latitude: number, longitude: number) => void;
  geocodingResult: Geocoding;
}) {
  const map = useMap();
  map.panTo([geocodingResult.latitude, geocodingResult.longitude]);
  map.on("click", e => {
    console.log(e);
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
