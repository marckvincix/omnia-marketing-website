"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GA4_PRESET_OPTIONS, getGa4MonthOptions } from "@/lib/analytics/period";

export function PeriodFilter({ period }: { period: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const monthOptions = getGa4MonthOptions();
  const allOptions = [...GA4_PRESET_OPTIONS, ...monthOptions];
  const labels = Object.fromEntries(allOptions.map((o) => [o.value, o.label]));

  function setPeriod(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === "30d") {
      params.delete("period");
    } else {
      params.set("period", value);
    }
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <Select value={period} onValueChange={setPeriod}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Periodo">{(v: string) => labels[v] ?? v}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Periodi rapidi</SelectLabel>
          {GA4_PRESET_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Mesi</SelectLabel>
          {monthOptions.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
