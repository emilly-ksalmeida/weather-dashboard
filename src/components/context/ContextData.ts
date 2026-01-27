import { createContext } from "react";
import type { Geocoding } from "@/utils/types";

interface IProviderContextProps {
  coordinates: Geocoding | null;
  setCoordinates: React.Dispatch<React.SetStateAction<Geocoding | null>>;
}

const ContextData = createContext<IProviderContextProps>({} as IProviderContextProps);

export default ContextData;
