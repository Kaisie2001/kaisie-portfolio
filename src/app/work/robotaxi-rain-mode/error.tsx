"use client";

export default function RobotaxiRainModeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <p className="text-sm font-medium text-stone-800">Prototype failed to load</p>
      <p className="mt-2 text-[12px] text-stone-500">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-stone-900 px-4 py-2 text-sm text-white"
      >
        Try again
      </button>
    </div>
  );
}
