import type { ReactNode } from "react";

type AddressFieldProps = {
  icon: ReactNode;
  label: string;
  value: string;
  placeholder?: boolean;
};

/** Figma gray rounded address row */
export function AddressField({ icon, label, value, placeholder }: AddressFieldProps) {
  return (
    <div className="address-field">
      <span className="address-field-icon">{icon}</span>
      <div>
        <p className="address-field-label">{label}</p>
        <p className={placeholder ? "address-field-placeholder" : "address-field-value"}>
          {value}
        </p>
      </div>
    </div>
  );
}
