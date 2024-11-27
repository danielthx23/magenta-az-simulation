"use client"

import { InputHTMLAttributes, ChangeEvent, useCallback, ReactNode, useState, useMemo } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  handleChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void
  label?: ReactNode
  customError?: string | null
  wrapperClassName?: string
}

const Input = ({ handleChange, disabled, readOnly, className = '', label = '', customError = '', wrapperClassName, ...props }: InputProps) => {
  const [error, setError] = useState<string | null>(null)

  const onHandleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { validity, validationMessage, value } = e.target
    setError(!validity.valid ? validationMessage : null)
    if (handleChange instanceof Function) {
      handleChange(value, e)
    }
  }, [handleChange])

  const errorMessage = useMemo(() => customError || error, [customError, error])
  const hasActionsState = useMemo(() => disabled || readOnly, [disabled, readOnly])
  const hasControllState = useMemo(() => hasActionsState || errorMessage, [hasActionsState, errorMessage])
  const canShowError = useMemo(() => errorMessage && !hasActionsState, [errorMessage, hasActionsState])

  return (
    <div className={wrapperClassName}>
      {label && (
        <label
          htmlFor={props.id ?? props.name ?? ''}
          className={`block font-medium mb-0.5 px-0.5 text-left text-neutral-900 text-sm`}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        onChange={onHandleChange}
        className={`
            rounded-lg px-4 py-2 h-fit w-60 bg-gray-100 placeholder-gray-400 outline-none
            ${!hasControllState ? 'bg-gray-100' : ''}
            ${disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''} 
            ${readOnly ? 'bg-gray-200 text-gray-400' : ''}
            ${canShowError ? 'border-red-500 border-2 ring-red-500' : ''} 
            ${className}
        `}
        disabled={disabled}
        readOnly={readOnly}
        />
      {canShowError && <span className={`
        min-h-4 text-red-500 text-xs px-0.5 pt-0.5 block leading-none 
        ${canShowError ? 'opacity-100 ' : 'opacity-0'}
      `}
      >
        {errorMessage}
      </span>}
    </div>
  )
}

export default Input