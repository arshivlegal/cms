"use client";
import React from "react";

export default function Textarea({ label, name, register, error, placeholder, rows = 2, defaultValue = "" }) {
  
  return (
    <div className="flex flex-col gap-s8 w-full">
      {label && <label className="body-default ">{label}</label>}

      <textarea
        {...register(name)}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        
        className={`border p-s16 rounded-r8 resize-none outline-none ${
          error ? "border-red-main" : "border-gray-300"
        }`}
      />

      {error && <p className="text-red-main text-sm">{error.message}</p>}
    </div>
  );
}
