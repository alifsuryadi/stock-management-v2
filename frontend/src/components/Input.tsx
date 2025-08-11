// frontend/src/components/Input.tsx
"use client";
import React from "react";

interface InputProps {
  type?: "text" | "email" | "number" | "date";
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  min?: string | number;
  minLength?: number;
  disabled?: boolean;
}

export default function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  label,
  icon: Icon,
  min,
  minLength,
  disabled = false,
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-white mb-3">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
          </div>
        )}
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input-dark ${Icon ? 'pl-12' : ''}`}
          placeholder={placeholder}
          min={min}
          minLength={minLength}
          disabled={disabled}
        />
      </div>
    </div>
  );
}