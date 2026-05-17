import type { ReactNode } from "react";

type MetricCardProps = {
  icon: ReactNode;
  children: ReactNode;
  tone?: "default" | "orange";
};

export function MetricCard({ icon, children, tone = "default" }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="mb-1">{icon}</div>
      <div className={["metric-text", tone === "orange" ? "orange" : ""].filter(Boolean).join(" ")}>
        {children}
      </div>
    </div>
  );
}
