import { useEffect, useContext } from "react";
import { MapContainer, Marker, useMap } from "react-leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import "leaflet/dist/leaflet.css";
import ContextData from "../context/ContextData.ts";
import type { Geocoding } from "../../utils/types.ts";

type Props = {
  geocodingResults: Geocoding;
};

export default function InteractiveMap({ geocodingResults }: Props) {
  const context = useContext(ContextData);
  const { onMapClick } = context;
  return (
    <MapContainer
      key={`${geocodingResults.latitude},${geocodingResults.longitude}`}
      center={[geocodingResults.latitude, geocodingResults.longitude]}
      zoom={12}
      style={{ width: "500px", height: "400px" }}
    >
      <MapClick onMapClick={onMapClick} geocodingResults={geocodingResults} />
      <MapStyle />
      <Marker position={[geocodingResults.latitude, geocodingResults.longitude]} />
    </MapContainer>
  );
}

function MapClick({
  onMapClick,
  geocodingResults,
}: {
  onMapClick: (latitude: number, longitude: number) => void;
  geocodingResults: Geocoding;
}) {
  const map = useMap();
  map.panTo([geocodingResults.latitude, geocodingResults.longitude]);
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
