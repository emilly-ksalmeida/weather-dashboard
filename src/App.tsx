import { Separator } from "@/components/ui/separator";
import LocationPicker from "./components/locationPicker/LocationPicker.tsx";
import InteractiveMap from "./components/map/InteractiveMap.tsx";
import ForecastCards from "./components/forecastCards/ForecastCards.tsx";

function App() {
  return (
    <div className="flex flex-col gap-2 px-10 py-12">
      <h1 className="text-3xl font-extrabold text-center p-4">Painel Climático</h1>
      <p>Procure uma cidade abaixo ou selecione pelo mapa:</p>
      <div className="flex flex-wrap justify-center gap-10">
        <LocationPicker />
        <InteractiveMap />
      </div>

      <Separator className="my-2" />

      <ForecastCards />
    </div>
  );
}

export default App;
