"use client";

const settingsSections = [
  "Theme",
  "Notifications",
  "Account",
  "Sessions",
  "Danger zone",
];

export function SettingsNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (section: string) => void;
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Settings sections">
      {settingsSections.map((section) => (
        <button
          className="rounded-md border px-3 py-2 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          data-active={active === section}
          key={section}
          onClick={() => onChange(section)}
          type="button"
        >
          {section}
        </button>
      ))}
    </nav>
  );
}
