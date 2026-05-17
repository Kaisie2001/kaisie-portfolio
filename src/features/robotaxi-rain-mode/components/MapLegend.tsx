type MapLegendProps = {
  showWalkingLegend?: boolean;
  showVehicleLegend?: boolean;
};

export function MapLegend({
  showWalkingLegend = false,
  showVehicleLegend = false,
}: MapLegendProps) {
  if (!showWalkingLegend && !showVehicleLegend) return null;

  return (
    <div className="pointer-events-none absolute bottom-2 left-2 z-[1000] rounded-lg bg-white/92 px-2 py-1.5 text-[8px] shadow-sm">
      {showWalkingLegend ? (
        <div className="mb-1 space-y-0.5">
          <LegendRow color="#34a853" dashed={false} label="Covered walk" />
          <LegendRow color="#34a853" dashed label="Rain-exposed walk" />
        </div>
      ) : null}
      {showVehicleLegend ? (
        <LegendRow color="#00a8b5" dashed label="Vehicle approach" />
      ) : null}
    </div>
  );
}

function LegendRow({
  color,
  dashed,
  label,
}: {
  color: string;
  dashed?: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[var(--rain-text-secondary,#8e8e93)]">
      <span
        className="inline-block h-0.5 w-4"
        style={{
          backgroundColor: dashed ? "transparent" : color,
          borderTop: dashed ? `2px dashed ${color}` : undefined,
        }}
      />
      {label}
    </div>
  );
}
