import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked, onChange, disabled = false }: SwitchProps) {
  return (
    <label className="relative inline-block w-12 h-6">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} className="sr-only" />
      <div className={`block w-12 h-6 rounded-full transition-colors ${disabled ? "bg-gray-400 dark:bg-gray-600" : checked ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-400 dark:bg-gray-600"}`}></div>
      <div className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-100 w-5 h-5 rounded-full transition-transform ${checked ? "translate-x-6" : "translate-x-0"}`}></div>
    </label>
  );
}

interface DropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Dropdown({ value, options, onChange, placeholder, disabled = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label || placeholder || "";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
          disabled ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
        } transition-colors`}
      >
        <span className="truncate max-w-32">{displayValue}</span>
        <ChevronDownIcon className="w-4 h-4 flex-shrink-0" />
      </button>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 z-20 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm ${
                    option.value === value ? "bg-blue-600 dark:bg-blue-500 text-white dark:text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  } transition-colors`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
