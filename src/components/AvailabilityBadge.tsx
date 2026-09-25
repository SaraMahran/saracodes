/** Pill badge with a softly pulsing secondary dot (the pulse stops under reduced motion). */
export function AvailabilityBadge({
  label,
  className = '',
}: {
  label: string;
  className?: string;
}) {
  return (
    <p
      className={`inline-flex items-center gap-2.5 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-sm text-text ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75 motion-safe:animate-ping" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
      </span>
      {label}
    </p>
  );
}
