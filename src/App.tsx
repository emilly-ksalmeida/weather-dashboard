import LocationPicker from "./components/locationPicker/LocationPicker";
import "./index.css";

function App() {
  return (
    <>
      <h1>Clima</h1>
      <p>Procure uma cidade ou selecione pelo mapa:</p>
      <LocationPicker />
    </>
  );
}

export default App;
