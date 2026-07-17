"use client";

interface IntensitySelectorProps {
  value: "low" | "medium" | "high";
  onChange: (value: "low" | "medium" | "high") => void;
  disabled?: boolean;
}

export function IntensitySelector({ value, onChange, disabled }: IntensitySelectorProps) {
  const options = [
    { id: "low", label: "Low", desc: "Minimal motion" },
    { id: "medium", label: "Medium", desc: "Balanced" },
    { id: "high", label: "High", desc: "Full effects" },
  ] as const;

  return (
    <div className={`grid grid-cols-3 gap-2 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
              isActive
                ? "border-pink-500 bg-pink-50 text-pink-700"
                : "border-gray-100 bg-white hover:border-pink-200 text-gray-600 hover:bg-pink-50/50"
            }`}
          >
            <span className={`font-semibold ${isActive ? "text-pink-700" : "text-gray-700"}`}>
              {opt.label}
            </span>
            <span className="text-xs opacity-75 mt-0.5">{opt.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
