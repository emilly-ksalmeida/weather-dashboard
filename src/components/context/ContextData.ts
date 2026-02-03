import { createContext } from "react";
import type { Geocoding } from "@/utils/types";

interface IProviderContextProps {
  coordinates: Geocoding;
  setCoordinates: React.Dispatch<React.SetStateAction<Geocoding>>;
}

const ContextData = createContext<IProviderContextProps>({} as IProviderContextProps);

export default ContextData;
