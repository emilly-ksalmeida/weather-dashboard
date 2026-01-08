import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ContextData from "../context/ContextData.ts";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import ptLocale from "i18n-iso-countries/langs/pt.json";
import countries from "i18n-iso-countries";
import { LuChevronsUpDown, LuCheck } from "react-icons/lu";
import { FaSearchLocation } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LocationPickerSchema } from "../../schemas/localizationSchema.ts";
import locationsBR from "../../assets/listStates.ts";

countries.registerLocale(ptLocale);

const countriesList = Object.entries(countries.getNames("pt", { select: "official" })).map(
  ([code, name]) => ({
    label: name,
    value: code.toUpperCase(),
  })
);

type LocationPickerSearch = z.infer<typeof LocationPickerSchema>;

export default function LocationPicker() {
  const context = useContext(ContextData);
  const { setLocation } = context;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<LocationPickerSearch>({
    resolver: zodResolver(LocationPickerSchema),
    mode: "onChange",
  });

  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  const [inputValue, setInputValue] = useState("");
  const exactMatch = countriesList.find(
    item => item.label.toLowerCase() === inputValue.toLowerCase()
  );
  const otherCountries = countriesList.filter(
    item => item.label.toLowerCase() !== inputValue.toLowerCase()
  );

  function search(data: LocationPickerSearch) {
    setLocation(data);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <form id="form-location-picker" className="px-4 py-8 w-78" onSubmit={handleSubmit(search)}>
        <FieldGroup>
          <Controller
            name="cityName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="search-city-name">Cidade:</FieldLabel>
                <FieldDescription>Digite o nome de uma cidade</FieldDescription>
                <Input
                  {...field}
                  id="search-city-name"
                  type="text"
                  aria-invalid={fieldState.invalid}
                  placeholder="Cidade"
                  autoComplete="on"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="state"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="picker-state">Escolha um estado brasileiro:</FieldLabel>
                  <FieldDescription>Válido apenas para o Brasil</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-[180px]"
                    id="picker-state"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Escolha um estado brasileiro" />
                  </SelectTrigger>
                  <SelectContent className="z-1001">
                    {locationsBR.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="country"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="search-country-name">País:</FieldLabel>
                <FieldDescription>Nomes dos país em português</FieldDescription>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-75 justify-between">
                      {selectedCode
                        ? countries.getName(selectedCode, "pt")
                        : "Selecione um país..."}
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
                                setValue("country", exactMatch.value);
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
                                setValue("country", country.value);
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

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <Field orientation="horizontal" className="flex flex-row justify-center">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Reiniciar
        </Button>
        <Button type="submit" form="form-location-picker">
          Pesquisar
          <FaSearchLocation />
        </Button>
      </Field>
    </div>
  );
}
