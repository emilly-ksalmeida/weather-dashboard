import * as z from "zod";

export const LocationPickerSchema = z.object({
  cityName: z
    .string({
      error: "Este campo é obrigatório",
    })
    .trim()
    .nonempty("Nome de Usuário é obrigatório.")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome deve conter apenas letras e espaços.")
    .refine(name => name.trim().length > 0, "Nome não pode conter apenas espaços."),
  state: z.string().optional(),
  country: z
    .string({
      error: "Este campo é obrigatório",
    })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome deve conter apenas letras e espaços.")
    .refine(name => name.trim().length > 0, "Nome não pode conter apenas espaços."),
});

export const GeocodingSchema = z.object({
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timeZone: z.string(),
  state: z.string(),
  country: z.string(),
});
