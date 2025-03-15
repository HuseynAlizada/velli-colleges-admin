
import type React from "react"

import { useState, useEffect } from "react"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  name: string
  id: string
}

export function PhoneInput({ value, onChange, name, id }: PhoneInputProps) {
  const [inputValue, setInputValue] = useState( value && value)
  

  useEffect(() => {
    if (!value && inputValue !== "+994 ") {
      setInputValue("+994 ")
    }
  }, [value, inputValue])

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters except '+'
    const cleaned = input.replace(/[^\d+]/g, "")

    // Ensure the number starts with +994
    if (!cleaned.startsWith("+994")) {
      return "+994 "
    }

    // Format the remaining digits in XXX XX XX pattern
    let formatted = "+994 "
    const remaining = cleaned.slice(4)

    // Add first group (3 digits)
    if (remaining.length > 0) {
      formatted += remaining.slice(0, 3)
    }

    // Add space and second group (2 digits)
    if (remaining.length > 3) {
      formatted += " " + remaining.slice(3, 5)
    }

    // Add space and third group (2 digits)
    if (remaining.length > 5) {
      formatted += " " + remaining.slice(5, 7)
    }

    return formatted
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setInputValue(formatted)
    onChange(formatted)
  }

  const isValidPhoneNumber = (phone: string) => {
    // Should match pattern: +994 XXX XX XX where X are digits
    return /^\+994 \d{3} \d{2} \d{2}$/.test(phone)
  }

  return (
    <div className="relative">
      <input
        type="tel"
        id={id}
        name={name}
        value={inputValue}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        placeholder="+994 562 53 06"
        minLength={14}
        maxLength={14}
        pattern="^\+994 \d{3} \d{2} \d{2}$"
        required
      />
      {inputValue.length > 5 && !isValidPhoneNumber(inputValue) && (
        <p className="absolute text-xs text-rose-500 mt-1">Format: +994 562 53 06</p>
      )}
    </div>
  )
}

