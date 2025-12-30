// import type { SetStateAction, Dispatch } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// type Props = {
//   location: string;
//   setLocation: Dispatch<SetStateAction<string>>;
// };

const locationsBR = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

export default function StateDropdown() {
  return (
    <Select value={location} onValueChange={value => setLocation(value)}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Escolha a cidade" />
      </SelectTrigger>
      <SelectContent className="z-1001">
        {locationsBR.map(city => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
