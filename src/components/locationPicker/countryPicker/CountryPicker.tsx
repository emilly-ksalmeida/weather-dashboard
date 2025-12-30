import { useState } from "react";
import ptLocale from "i18n-iso-countries/langs/pt.json";
import countries from "i18n-iso-countries";
import { LuChevronsUpDown, LuCheck } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

countries.registerLocale(ptLocale);

const countriesList = Object.entries(countries.getNames("pt", { select: "official" })).map(
  ([code, name]) => ({
    label: name,
    value: code.toUpperCase(),
  })
);

export function CountryPicker() {
  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  const [inputValue, setInputValue] = useState("");
  const exactMatch = countriesList.find(
    item => item.label.toLowerCase() === inputValue.toLowerCase()
  );
  const otherCountries = countriesList.filter(
    item => item.label.toLowerCase() !== inputValue.toLowerCase()
  );

  return (
    <div className="flex flex-col gap-2 bg-pink-200">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-75 justify-between">
            {selectedCode ? countries.getName(selectedCode, "pt") : "Selecione um país..."}
            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-75 p-0">
          <Command>
            <CommandInput placeholder="Digite o país..." onValueChange={setInputValue} />
            <CommandList>
              <CommandEmpty>Nenhum país encontrado.</CommandEmpty>

              {exactMatch && (
                <CommandGroup heading="Resultado Exato">
                  <CommandItem
                    value={exactMatch.label}
                    onSelect={() => {
                      setSelectedCode(exactMatch.value);
                      setOpen(false);
                    }}
                  >
                    <LuCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCode === exactMatch.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {exactMatch.label}
                  </CommandItem>
                </CommandGroup>
              )}

              <CommandGroup heading="Sugestões">
                {otherCountries.map(country => (
                  <CommandItem
                    key={country.value}
                    value={country.label}
                    onSelect={() => {
                      setSelectedCode(country.value);
                      setOpen(false);
                    }}
                  >
                    <LuCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCode === country.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {country.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <p className="text-sm text-muted-foreground">
        Código selecionado: <strong>{selectedCode}</strong>
      </p>
    </div>
  );
}
