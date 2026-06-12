"use client";

import { formatYenPrice, getPriceOptionsForType } from "../lib/price-options";
import type { ContentType } from "../types/content-type";

interface PriceDropdownProps {
  contentType: ContentType;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function PriceDropdown({
  contentType,
  value,
  onChange,
  disabled = false,
}: PriceDropdownProps) {
  const options = getPriceOptionsForType(contentType);

  return (
    <select
      className='PriceDropdown border-input bg-background focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-3 text-sm focus-visible:ring-3 focus-visible:outline-none disabled:opacity-50'
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
      aria-label='価格を選択'
    >
      <option value='' disabled>
        価格を選択
      </option>
      {options.map((price) => (
        <option key={price} value={price}>
          {formatYenPrice(price)}
        </option>
      ))}
    </select>
  );
}
