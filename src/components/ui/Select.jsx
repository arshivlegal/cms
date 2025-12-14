"use client";
import React from "react";

export default function Select({ 
  label, 
  name, 
  register, 
  options = [], 
  error,
  value,        // Add these for controlled mode
  onChange,     // Add these for controlled mode
}) {
  // If register exists, use react-hook-form mode
  // Otherwise use controlled mode with value/onChange
  const isControlled = value !== undefined && onChange !== undefined;

  return (
    <div className="flex flex-col gap-s8 w-full">
      {label && <label className="text-small">{label} <span className="text-red-main text-small">*</span></label>}

      <select
        {...(isControlled ? { value, onChange } : register(name))}
        className={`
          border rounded-r8 p-s16 outline-none 
          focus:ring-2 focus:ring-primary-main
          appearance-none bg-background text-foreground
          ${error ? "border-red-main" : "border-gray-300"}
        `}
      >
        <option value="">Select {label?.toLowerCase() || 'option'}</option>

        {options.map((opt) => {
          const label = typeof opt === "string" ? opt : opt.label;
          const value = typeof opt === "string" ? opt : opt.value;

          return (
            <option
              key={value}
              value={value}
              className="bg-background text-foreground"
            >
              {label}
            </option>
          );
        })}
      </select>

      {error && <p className="text-red-main text-sm">{error.message}</p>}
    </div>
  );
}