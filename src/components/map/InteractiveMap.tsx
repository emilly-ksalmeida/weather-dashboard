import { useEffect, useContext } from "react";
import ContextData from "../context/ContextData.ts";
import { MapContainer, Marker, useMap } from "react-leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import "leaflet/dist/leaflet.css";

export default function InteractiveMap() {
  const context = useContext(ContextData);
  const { coordinates } = context;

  return (
    <MapContainer
      key={`${coordinates.latitude},${coordinates.longitude}`}
      center={[coordinates.latitude, coordinates.longitude]}
      zoom={12}
      style={{ width: "500px", height: "400px" }}
    >
      <MapClick />
      <MapStyle />
      <Marker position={[coordinates.latitude, coordinates.longitude]} />
    </MapContainer>
  );
}

function MapClick() {
  const context = useContext(ContextData);
  const { coordinates, setCoordinates } = context;

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
  map.panTo([coordinates.latitude, coordinates.longitude]);
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
