
import type React from "react";
import { useState, useEffect } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name: string;
  id: string;
}

export function PhoneInput({ value, onChange, name, id, placeholder }: PhoneInputProps) {
  const [inputValue, setInputValue] = useState(value || "+994 ");

  // Sync internal state with the value prop whenever it changes
  useEffect(() => {
    setInputValue(formatPhoneNumber(value || "+994 ")); // Format and set the value
  }, [value]);

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters except '+'
    const cleaned = input.replace(/[^\d+]/g, "");

    // Ensure the number starts with +994
    if (!cleaned.startsWith("+994")) {
      return "+994 ";
    }

    // Format the remaining digits in XXX XXX XX XX pattern
    let formatted = "+994 ";
    const remaining = cleaned.slice(4);

    if (remaining.length > 0) {
      formatted += remaining.slice(0, 3);
    }
    if (remaining.length > 3) {
      formatted += " " + remaining.slice(3, 6);
    }
    if (remaining.length > 6) {
      formatted += " " + remaining.slice(6, 8);
    }
    if (remaining.length > 8) {
      formatted += " " + remaining.slice(8, 10);
    }

    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setInputValue(formatted);
    onChange(formatted); // Notify parent of the change
  };

  const isValidPhoneNumber = (phone: string) => {
    return /^\+994 \d{3} \d{3} \d{2} \d{2}$/.test(phone);
  };

  return (
    <div className="relative">
      <input
        type="tel"
        id={id}
        name={name}
        value={inputValue} // Controlled by internal state, synced with prop
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#487ACB] focus:border-transparent"
        placeholder={placeholder || "+994 050 562 53 06"}
        minLength={17}
        maxLength={18}
        pattern="^\+994 \d{3} \d{3} \d{2} \d{2}$"
        required
      />
      {inputValue.length > 5 && !isValidPhoneNumber(inputValue) && (
        <p className="absolute text-xs text-red-500 mt-1">Format: +994 050 562 53 06</p>
      )}
    </div>
  );
}



