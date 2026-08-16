"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "__all__";

const SEGMENT_LABELS: Record<string, string> = {
  [ALL]: "Tutti i segmenti",
  Caldo: "Caldo",
  Tiepido: "Tiepido",
  Freddo: "Freddo",
};

export function VisitorFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const segment = searchParams.get("segment") ?? ALL;
  const city = searchParams.get("city") ?? ALL;

  function setParam(key: string, value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <Select value={segment} onValueChange={(v) => setParam("segment", v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Segmento">
            {(v: string) => SEGMENT_LABELS[v] ?? v}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Tutti i segmenti</SelectItem>
          <SelectItem value="Caldo">Caldo</SelectItem>
          <SelectItem value="Tiepido">Tiepido</SelectItem>
          <SelectItem value="Freddo">Freddo</SelectItem>
        </SelectContent>
      </Select>

      <Select value={city} onValueChange={(v) => setParam("city", v)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Città">
            {(v: string) => (v === ALL ? "Tutte le città" : v)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Tutte le città</SelectItem>
          {cities.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
