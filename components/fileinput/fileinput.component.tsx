"use client";

import { ChangeEvent, useCallback, useState } from "react";
import Image from 'next/image';

interface FileInputProps {
  handleChange?: (file: File | null, e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  customError?: string | null;
  wrapperClassName?: string;
  name?: string; 
}

const FileInput = ({ handleChange, label, customError, wrapperClassName, name }: FileInputProps) => {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onHandleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileName(file ? file.name : null);
    setError(file && !file.type.startsWith("image/") ? "Por favor selecione uma imagem." : null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    if (handleChange instanceof Function) {
      handleChange(file, e);
    }
  }, [handleChange]);

  const errorMessage = customError || error;

  return (
    <div className={`${wrapperClassName} flex flex-col gap-2 justify-center items-center`}>
      {label && (
        <label className="block font-medium mb-1 text-left text-neutral-900 text-sm">
          {label}
        </label>
      )}
      <div className={`relative flex items-center justify-center w-40 h-40 rounded-full border-2 border-dashed ${errorMessage ? 'border-red-500' : 'border-gray-300'} cursor-pointer`}>
        {imagePreview ? (
          <Image height={500} width={500} src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <span className="text-sm text-gray-400">Nenhuma foto de perfil.</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
          <input
            type="file"
            accept="image/*"
            onChange={onHandleChange}
            name={name} 
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-[#e3017e]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
      <p>Imagem escolhida: {fileName}</p>
      {errorMessage && (
        <span className="min-h-4 text-red-500 text-xs px-0.5 pt-0.5 block leading-none">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default FileInput;