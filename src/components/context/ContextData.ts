import { createContext } from "react";
import type { Location, Geocoding } from "@/utils/types";

interface IProviderContextProps {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  coordinates: Geocoding;
  setCoordinates: React.Dispatch<React.SetStateAction<Geocoding>>;
  onMapClick: (latitude: number, longitude: number) => void;
}

const ContextData = createContext<IProviderContextProps>({} as IProviderContextProps);

export default ContextData;
