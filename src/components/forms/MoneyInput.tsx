"use client";

export default function MoneyInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
        £
      </span>
      <input
        {...props}
        className={`pl-6 ${props.className || ""}`}
        inputMode="decimal"
      />
    </div>
  );
}
