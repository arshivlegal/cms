"use client";
import React from "react";

export default function FileInput({ label, onChange, fileName, accept = "image/*" }) {
  return (
    <div className="flex flex-col gap-s8 w-full">
      {label && (
        <label className="body-default text-main">{label}<span className="text-red-main ">*</span></label>
      )}
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="block w-full text-sm p-s8 text-gray-900 border border-blue-300 rounded-lg cursor-pointer bg-gray-50"
      />
      {fileName && (
        <p className="body-small text-secondary mt-s4">Selected: {fileName}</p>
      )}
    </div>
  );
}
