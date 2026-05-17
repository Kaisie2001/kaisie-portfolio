import { CheckIcon } from "./icons/RainModeIcons";

type ValidationBannerProps = {
  message: string;
};

export function ValidationBanner({ message }: ValidationBannerProps) {
  return (
    <div className="banner-valid">
      <CheckIcon className="h-3.5 w-3.5 shrink-0" color="#34a853" />
      <span>{message}</span>
    </div>
  );
}
