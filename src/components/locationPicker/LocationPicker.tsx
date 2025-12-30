import { CountryPicker } from "./countryPicker/CountryPicker";
import { Input } from "../ui/input";
import StateDropdown from "./stateDropdown/StateDropdown";

export default function LocationPicker() {
  return (
    <div>
      <div className="flex flex-row bg-sky-300">
        <Input placeholder="Nome da Cidade" type="text" />
        <StateDropdown />
        <CountryPicker />
      </div>
    </div>
  );
}
