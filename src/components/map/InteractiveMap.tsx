import { useEffect, useContext } from "react";
import { MapContainer, Marker, useMap } from "react-leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import "leaflet/dist/leaflet.css";
import ContextData from "../context/ContextData.ts";
import type { Geocoding } from "../../utils/types.ts";

export default function InteractiveMap() {
  const context = useContext(ContextData);
  const { coordinates, setCoordinates } = context;
  return (
    <MapContainer
      key={`${coordinates.latitude},${coordinates.longitude}`}
      center={[coordinates.latitude, coordinates.longitude]}
      zoom={12}
      style={{ width: "500px", height: "400px" }}
    >
      <MapClick coordinates={coordinates} setCoordinates={setCoordinates} />
      <MapStyle />
      <Marker position={[coordinates.latitude, coordinates.longitude]} />
    </MapContainer>
  );
}

function MapClick({
  coordinates,
  setCoordinates,
}: {
  coordinates: Geocoding;
  setCoordinates: React.Dispatch<React.SetStateAction<Geocoding>>;
}) {
  const map = useMap();
  map.panTo([coordinates.latitude, coordinates.longitude]);
  map.on("click", e => {
    const { lat: eventLat, lng: eventLng } = e.latlng;
    // onMapClick(eventLat, eventLng);
    setCoordinates({
      name: "Local escolhido no mapa",
      latitude: eventLat,
      longitude: eventLng,
      timeZone: "--",
      state: "--",
      country: "Local escolhido no mapa",
    });
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
