import type React from "react"
import { useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

interface PasswordInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  name: string
  id: string
}

export function PasswordInput({ value, onChange, name, id }: PasswordInputProps) {
  const [showRequirements, setShowRequirements] = useState(false)

  const requirements = {
    uppercase: /[A-Z]/.test(value),
    number: /[0-9]/.test(value),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    minLength: value.length >= 8,
  }

  const allRequirementsMet = Object.values(requirements).every(Boolean)

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="password"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setShowRequirements(true)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
            value && !allRequirementsMet ? "border-rose-500" : "border-gray-300"
          }`}
          placeholder="Enter Password"
          required
        />
      </div>

      {showRequirements && (
        <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-md">
          <h4 className="font-medium text-gray-700">Password must contain:</h4>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              {requirements.uppercase ? (
                <CheckIcon className="w-4 h-4 text-green-500" />
              ) : (
                <CloseIcon className="w-4 h-4 text-rose-500" />
              )}
              <span className={requirements.uppercase ? "text-green-700" : "text-rose-700"}>
                At least one uppercase letter
              </span>
            </li>
            <li className="flex items-center gap-2">
              {requirements.number ? (
                <CheckIcon className="w-4 h-4 text-green-500" />
              ) : (
                <CloseIcon className="w-4 h-4 text-rose-500" />
              )}
              <span className={requirements.number ? "text-green-700" : "text-rose-700"}>At least one number</span>
            </li>
            <li className="flex items-center gap-2">
              {requirements.symbol ? (
                <CheckIcon className="w-4 h-4 text-green-500" />
              ) : (
                <CloseIcon className="w-4 h-4 text-rose-500" />
              )}
              <span className={requirements.symbol ? "text-green-700" : "text-rose-700"}>
                At least one symbol (!@#$%^&*(),.?":{}|&lt;&gt;)
              </span>
            </li>
            <li className="flex items-center gap-2">
              {requirements.minLength ? (
                <CheckIcon className="w-4 h-4 text-green-500" />
              ) : (
                <CloseIcon className="w-4 h-4 text-rose-500" />
              )}
              <span className={requirements.minLength ? "text-green-700" : "text-rose-700"}>Minimum 8 characters</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

