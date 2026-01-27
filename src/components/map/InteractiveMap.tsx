import { useEffect, useContext } from "react";
// import ContextData from "../context/ContextData.ts";
import { MapContainer, Marker, useMap } from "react-leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import "leaflet/dist/leaflet.css";
import type { Geocoding } from "@/utils/types";

type Props = {
  coordinates: Geocoding | null;
  setCoordinates: React.Dispatch<React.SetStateAction<Geocoding>>;
};

export default function InteractiveMap({ coordinates, setCoordinates }: Props) {
  return (
    <MapContainer
      key={`${coordinates?.latitude},${coordinates?.longitude}`}
      center={[coordinates?.latitude ?? 0, coordinates?.longitude ?? 0]}
      zoom={12}
      style={{ width: "500px", height: "400px" }}
    >
      <MapClick coordinates={coordinates} setCoordinates={setCoordinates} />
      <MapStyle />
      <Marker position={[coordinates?.latitude ?? 0, coordinates?.longitude ?? 0]} />
    </MapContainer>
  );
}

function MapClick({ coordinates, setCoordinates }: Props) {
  const onMapClick = (latitude: number, longitude: number) => {
    setCoordinates({
      name: "Local escolhido no mapa",
      latitude: latitude,
      longitude: longitude,
      timeZone: "--",
      state: "--",
      country: "--",
    });
  };

  const map = useMap();
  map.panTo([coordinates?.latitude ?? 0, coordinates?.longitude ?? 0]);
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
