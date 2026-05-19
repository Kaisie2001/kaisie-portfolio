import type { ReactNode } from "react";
import type { Lang } from "@/lib/portfolioCopy";
import type { GuidedDemoStepId } from "./guidedDemoCopy";
import type { CompareOptionId } from "./guidedDemoFrozenScenario";
import {
  GdIconAlertGray,
  GdIconBack,
  GdIconCar,
  GdIconCheckBadge,
  GdIconClock,
  GdIconCloud,
  GdIconInfoBlue,
  GdIconPeople,
  GdIconPin,
  GdIconPinTeal,
  GdIconRoad,
  GdIconTargetBlue,
  GdIconUmbrella,
  GdIconWalk,
} from "./GuidedDemoIcons";
import {
  exposureLabel,
  formatEta,
  formatExposure,
  formatWalk,
  getCompareOptions,
  getSelectedFrozenOption,
  GUIDED_DEMO_FROZEN_SCENARIO,
  tripLabels,
} from "./guidedDemoStaticData";

type Props = {
  stepId: GuidedDemoStepId;
  lang: Lang;
  highlightPickupId?: CompareOptionId;
};

const fieldClass = "flex min-h-8 items-center gap-2 rounded-xl bg-zinc-100 px-2.5 py-2";
const tinyMuted = "m-0 text-[9px] leading-tight text-zinc-500";
const valueText = "m-0 text-xs font-semibold leading-tight text-zinc-900";

export function GuidedDemoStaticScreen({
  stepId,
  lang,
  highlightPickupId = "sheltered",
}: Props) {
  const labels = tripLabels(lang);
  const scenario = GUIDED_DEMO_FROZEN_SCENARIO;
  const selected = getSelectedFrozenOption();
  const compareOptions = getCompareOptions();
  const orderedCompareOptions =
    stepId === 2
      ? [
          ...compareOptions.filter((option) => option.id === highlightPickupId),
          ...compareOptions.filter((option) => option.id !== highlightPickupId),
        ]
      : compareOptions;

  if (stepId === 1) {
    return (
      <>
        <p className="m-0 mb-1 text-[10px] leading-snug text-zinc-500">
          {scenario.area.subtitle[lang]}
        </p>
        <div className={fieldClass}>
          <GdIconPinTeal />
          <div className="min-w-0">
            <p className={tinyMuted}>{lang === "zh" ? "上车点" : "Pick-up"}</p>
            <p className={valueText}>{labels.pickup}</p>
          </div>
        </div>
        <div className={fieldClass}>
          <GdIconTargetBlue />
          <div className="min-w-0">
            <p className={tinyMuted}>{lang === "zh" ? "目的地" : "Drop-off"}</p>
            <p className={valueText}>{labels.dropoff}</p>
          </div>
        </div>
        <div className="flex min-h-8 items-center gap-2 rounded-xl bg-cyan-50 px-2.5 py-2 text-[10px] leading-snug text-sky-700">
          <GdIconInfoBlue />
          <span>
            {lang === "zh"
              ? "Rain Mode 将帮助优化您的上车体验"
              : "Rain Mode will help optimize your pick-up"}
          </span>
        </div>
        <button type="button" className="mt-auto min-h-8 rounded-xl border-0 bg-cyan-600 text-xs font-bold text-white" tabIndex={-1}>
          {lang === "zh" ? "呼叫 Robotaxi" : "Request Robotaxi"}
        </button>
      </>
    );
  }

  if (stepId === 2) {
    return (
      <>
        <header className="relative flex min-h-7 items-center">
          <span className="text-zinc-700" aria-hidden>
            <GdIconBack />
          </span>
          <h3 className="absolute left-6 right-6 m-0 text-center text-sm font-bold leading-tight text-zinc-900">
            {lang === "zh" ? "附近上车区域" : "Pick-up zones nearby"}
          </h3>
        </header>
        <p className="m-0 mb-1 text-[9px] leading-snug text-zinc-500">
          {lang === "zh"
            ? `${scenario.area.title.zh} · 三种方案比较`
            : `${scenario.area.title.en} · compare three zones`}
        </p>
        <div className="grid gap-1">
          {orderedCompareOptions.map((option) => {
            const isSelected = option.id === highlightPickupId;
            return (
              <div
                key={option.id}
                className={[
                  "grid min-h-9 grid-cols-[minmax(0,1.28fr)_0.62fr_0.62fr_0.52fr] items-center gap-1 rounded-xl border px-1.5 py-1.5",
                  isSelected ? "border-cyan-600/25 shadow-sm" : "border-transparent bg-zinc-50",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  background: isSelected
                    ? option.id === "sheltered"
                      ? "#e8f6ec"
                      : option.id === "farthest"
                        ? "#fdecea"
                        : "#fff4e5"
                    : undefined,
                }}
              >
                <div className="min-w-0">
                  <GdIconPin color={option.color} />
                  <p className="m-0 truncate text-[9.5px] font-bold leading-tight" style={{ color: option.color }}>
                    {option.name[lang]}
                  </p>
                  <p className={tinyMuted}>{option.sub[lang]}</p>
                </div>
                <MetricMini label={lang === "zh" ? "步行" : "Walk"} value={formatWalk(option)} />
                <MetricMini label={lang === "zh" ? "暴露" : "Rain"} value={formatExposure(option)} color={option.color} />
                <MetricMini label="ETA" value={formatEta(option)} />
              </div>
            );
          })}
        </div>
        <button type="button" className="mt-auto min-h-8 rounded-xl border-0 bg-cyan-600 text-xs font-bold text-white" tabIndex={-1}>
          {lang === "zh" ? "确认上车区域" : "Confirm pick-up zone"}
        </button>
      </>
    );
  }

  if (stepId === 3) {
    return (
      <>
        <SheetTitle>
          {lang === "zh" ? "正在为您匹配 Robotaxi" : "Finding your Robotaxi"}
        </SheetTitle>
        <p className="m-0 text-[10px] leading-snug text-zinc-500">
          {lang === "zh"
            ? "正在为您选择的上车区域搜索附近车辆"
            : "Searching nearby vehicles for your selected pickup zone"}
        </p>
        <div className={fieldClass}>
          <GdIconPinTeal />
          <span className="text-[11px] text-zinc-700">
            {lang === "zh" ? "上车点：" : "Pickup: "}
            <strong>{labels.pickupZone}</strong>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <InfoTile icon={<GdIconClock />} label={lang === "zh" ? "预计等待：" : "Estimated wait:"} value={scenario.search.waitLabel[lang]} />
          <InfoTile icon={<GdIconPeople />} label={lang === "zh" ? "排队：" : "Queue ahead:"} value={lang === "zh" ? `${scenario.search.queue} 个请求` : `${scenario.search.queue} requests`} />
          <InfoTile icon={<GdIconCar />} label={lang === "zh" ? "附近：" : "Nearby:"} value={`${scenario.search.nearbyVehicles}`} />
          <InfoTile icon={<GdIconCloud />} label={lang === "zh" ? "雨天延迟：" : "Rain delay:"} value={scenario.search.rainDelayLabel[lang]} warn />
        </div>
        <div className="flex min-h-8 items-center gap-2 rounded-xl bg-zinc-100 px-2.5 py-2 text-[10px] leading-snug text-zinc-600">
          <GdIconAlertGray />
          <span>
            {lang === "zh"
              ? "雨天可能略微影响派车时间。"
              : "Rain may slightly affect dispatch time."}
          </span>
        </div>
        <button type="button" className="mt-auto border-0 bg-transparent text-[11px] font-semibold text-zinc-500" tabIndex={-1}>
          {lang === "zh" ? "取消请求" : "Cancel request"}
        </button>
      </>
    );
  }

  return (
    <>
      <SheetTitle>{lang === "zh" ? "Robotaxi 正在前往" : "Robotaxi is on the way"}</SheetTitle>
      <div className="grid grid-cols-3 gap-1.5">
        <StatCell icon={<GdIconCar />} value={`${scenario.enRoute.vehicleKm.toFixed(1)} km`} />
        <StatCell icon={<GdIconClock />} value={lang === "zh" ? `约 ${scenario.enRoute.etaMin} 分钟` : `In ${scenario.enRoute.etaMin} min`} />
        <StatCell icon={<GdIconRoad />} value={scenario.enRoute.street[lang]} />
      </div>
      <div className={fieldClass}>
        <GdIconWalk />
        <span className="text-[11px] text-zinc-700">
          {lang === "zh" ? `步行 ${selected.walkM} m · 约 ` : `Walk ${selected.walkM} m · about `}
          <strong>{selected.walkMin} {lang === "zh" ? "分钟" : "min"}</strong>
        </span>
      </div>
      <div className={fieldClass}>
        <GdIconUmbrella />
        <span className="text-[11px] text-zinc-700">
          {lang === "zh" ? "仅 " : "Only "}
          <strong>{selected.exposureM} m</strong>
          {lang === "zh" ? " 暴露在雨中（" : " exposed ("}
          {exposureLabel(selected.exposureLevel, lang)}
          {lang === "zh" ? "）" : ")"}
        </span>
      </div>
      <div className="flex min-h-8 items-center gap-2 rounded-xl bg-green-50 px-2.5 py-2 text-[10px] leading-snug text-green-700">
        <GdIconCheckBadge />
        <span>{lang === "zh" ? "有效的 Robotaxi 上车候选点" : "Valid Robotaxi pick-up candidate"}</span>
      </div>
      <button type="button" className="mt-auto min-h-8 rounded-xl border-0 bg-cyan-600 text-xs font-bold text-white" tabIndex={-1}>
        {lang === "zh" ? "确认" : "Confirm"}
      </button>
    </>
  );
}

function MetricMini({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="min-w-0">
      <p className={tinyMuted}>{label}</p>
      <p className="m-0 truncate text-[9.5px] font-bold leading-tight text-zinc-900" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function SheetTitle({ children }: { children: ReactNode }) {
  return (
    <header className="relative flex min-h-7 items-center">
      <span className="text-zinc-700" aria-hidden>
        <GdIconBack />
      </span>
      <h3 className="absolute left-6 right-6 m-0 text-center text-sm font-bold leading-tight text-zinc-900">
        {children}
      </h3>
    </header>
  );
}

function InfoTile({
  icon,
  label,
  value,
  warn,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className={`min-h-11 rounded-xl p-2 ${warn ? "bg-amber-50" : "bg-zinc-50"}`}>
      <div className="text-cyan-600">{icon}</div>
      <span className="block text-[9px] leading-tight text-zinc-500">{label}</span>
      <span className="mt-0.5 block text-[9px] font-bold leading-tight text-zinc-900">{value}</span>
    </div>
  );
}

function StatCell({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-zinc-50 p-2 text-center">
      <div className="grid h-[18px] place-items-center text-cyan-600">{icon}</div>
      <p className="m-0 mt-1 truncate text-[9px] font-bold leading-tight text-zinc-900">{value}</p>
    </div>
  );
}
