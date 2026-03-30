"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface EventFiltersProps {
  areas: string[];
  searchValue: string;
  selectedArea: string;
  onSearchChange: (value: string) => void;
  onAreaChange: (value: string) => void;
}

export function EventFilters({
  areas,
  searchValue,
  selectedArea,
  onAreaChange,
  onSearchChange,
}: EventFiltersProps) {
  return (
    <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-soft md:grid-cols-[1.5fr_0.7fr]">
      <div className="space-y-2">
        <label className="text-sm font-medium text-cedar">Search events</label>
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title or topic"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-cedar">Area</label>
        <Select
          value={selectedArea}
          onChange={(event) => onAreaChange(event.target.value)}
        >
          <option value="">All areas</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

