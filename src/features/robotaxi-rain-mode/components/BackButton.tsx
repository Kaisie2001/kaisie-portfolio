import { BackIcon } from "./icons/RainModeIcons";

type BackButtonProps = {
  onClick: () => void;
  label?: string;
};

export function BackButton({ onClick, label = "Back" }: BackButtonProps) {
  return (
    <button type="button" className="back-btn" onClick={onClick} aria-label={label}>
      <BackIcon />
    </button>
  );
}
