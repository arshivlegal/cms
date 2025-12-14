"use client";
import React from "react";

export default function Input({ 
  label, 
  name, 
  register, 
  error, 
  type = "text", 
  placeholder,
  // Add controlled input props
  value,
  onChange,
  onKeyDown,
 
  className = ""
}) {
  // Check if this is a controlled input (not using react-hook-form)
  const isControlled = value !== undefined && onChange !== undefined;
  
  return (
    <div className="flex flex-col gap-s8 w-full">
      {label && <label className=" text-text-main  text-small">{label}<span className="text-red-main">*</span></label>}
      <input
        {...(isControlled ? {} : register(name))}
        type={type}
        placeholder={placeholder}
        value={isControlled ? value : undefined}
        onChange={isControlled ? onChange : undefined}
        onKeyDown={onKeyDown}
        className={`border rounded-r8 p-s16 outline-none focus:ring-2 focus:ring-primary-main font-secondary text-sm ${
          error ? "border-red-main" : "border-gray-300"
        } ${className}`}
      />
      {error && <p className="text-red-main text-sm font-secondary">{error.message || error}</p>}
    </div>
  );
}