"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LABELS: Record<string, string> = {
  day: "Oggi",
  month: "Ultimi 30 giorni",
  year: "Ultimi 365 giorni",
};

export function PeriodFilter({ period }: { period: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setPeriod(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === "month") {
      params.delete("period");
    } else {
      params.set("period", value);
    }
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <Select value={period} onValueChange={setPeriod}>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Periodo">{(v: string) => LABELS[v] ?? v}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="day">Giorno</SelectItem>
        <SelectItem value="month">Mese</SelectItem>
        <SelectItem value="year">Anno</SelectItem>
      </SelectContent>
    </Select>
  );
}
