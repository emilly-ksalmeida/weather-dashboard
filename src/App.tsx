import { useState } from "react";
import LocationPicker from "./components/locationPicker/LocationPicker.tsx";
import "./index.css";

function App() {
  const [location, setLocation] = useState<string>("Brasília");

  return (
    <>
      <h1 className="text-3xl font-extrabold text-center p-4">Painel Climático</h1>
      <p>Procure uma cidade ou selecione pelo mapa:</p>
      <LocationPicker location={location} setLocation={setLocation} />
      <p className="bg-sky-300 p-4">Teste Nome da cidade: {location}</p>
    </>
  );
}

export default App;
