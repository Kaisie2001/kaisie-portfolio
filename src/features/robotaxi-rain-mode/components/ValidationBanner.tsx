import { CheckIcon } from "./icons/RainModeIcons";

type ValidationBannerProps = {
  message: string;
  submessage?: string;
};

export function ValidationBanner({ message, submessage }: ValidationBannerProps) {
  void submessage;
  return (
    <div className="banner-valid">
      <CheckIcon className="h-3.5 w-3.5 shrink-0" color="#34a853" />
      <span>{message}</span>
    </div>
  );
}
