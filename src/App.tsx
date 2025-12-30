import { CountryPicker } from "./components/CountryPicker";
import "./index.css";

function App() {
  return (
    <>
      <h1>Clima</h1>
      <p>Procure uma cidade ou selecione pelo mapa:</p>
      <div>
        <input type="text" name="" id="" placeholder="Cidade" />
        <input type="text" name="" id="" placeholder="Estado Brasileiro" />
        <CountryPicker />
      </div>
    </>
  );
}

export default App;
