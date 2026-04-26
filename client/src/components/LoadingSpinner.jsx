import React from "react";

export default function LoadingSpinner({ fullScreen = false, size = "md", text = "" }) {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} border-3 border-cream border-t-teal-950 rounded-full animate-spin`}
        style={{ borderWidth: "3px", borderColor: "#EDE4D6", borderTopColor: "#0B3D40" }}
      />
      {text && <p className="font-body text-sm text-teal-950/60">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cream-dark border-t-teal-950 rounded-full animate-spin"
            style={{ borderColor: "#EDE4D6", borderTopColor: "#0B3D40" }}
          />
          <span className="font-display text-2xl font-600 text-teal-950">
            One<span className="text-gold-500">Reserve</span>
          </span>
        </div>
      </div>
    );
  }

  return spinner;
}