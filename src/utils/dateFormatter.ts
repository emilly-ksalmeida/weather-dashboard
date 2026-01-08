import { format, setDefaultOptions } from "date-fns";
import { ptBR } from "date-fns/locale";

setDefaultOptions({ locale: ptBR });

export function formatDate(data: string) {
  return format(new Date(data), "dd/MM/yyyy");
}

export function formatWeekday(data: string) {
  return format(new Date(data), "eeee");
}

export function formatTime(data: string) {
  return format(new Date(data), "HH:mm");
}

export function formatDateTime(data: string) {
  return format(new Date(data), "dd/MM/yyyy HH:mm");
}
