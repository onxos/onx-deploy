import { defaultTitanPersonas } from "@/lib/ai/persona-loader";

type TitanSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TitanSelector({ value, onChange }: TitanSelectorProps) {
  return (
    <label className="block text-sm font-semibold text-[#1e2d3d]">
      Titan
      <select
        className="mt-2 w-full rounded border p-2 text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {defaultTitanPersonas.map((persona) => (
          <option key={persona.titanId} value={persona.titanId}>
            {persona.displayName} - {persona.domain}
          </option>
        ))}
      </select>
    </label>
  );
}
