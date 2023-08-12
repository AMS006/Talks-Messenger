'use client'
import React, { useState } from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'

interface InputProps {
  type?: string,
  required?: boolean
  label: string
  id: string,
  placeholder: string,
  disabled?: boolean,
  register: UseFormRegister<FieldValues>
  error: FieldErrors
}
const Input: React.FC<InputProps> = ({
  type, required, label, id, placeholder, disabled, register, error
}) => {
  const [hide, setHide] = useState(true)
  return (
    <div className='relative'>
      <label
        htmlFor={id}
        className='text-sm font-semibold'>{label}</label>
      <input
        type={`${type === 'password' && hide === false ? 'text' : type}`}
        id={id}
        autoComplete={id}
        required={required}
        placeholder={placeholder}
        {...register(id, { required })}
        disabled={disabled}
        className={`form-input relative w-full border-0 ring-1 focus:ring-2 rounded-md text-black font-medium shadow-sm text-sm placeholder:text-gray-400 ${disabled ? 'cursor-default opacity-50' : ''}`}
      />

      {type === 'password' &&
        <span className=' text-gray-500 z-20 absolute top-8 right-3 cursor-pointer' onClick={() => setHide(!hide)}>
          {hide ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
        </span>}

    </div>
  )
}

export default Input
