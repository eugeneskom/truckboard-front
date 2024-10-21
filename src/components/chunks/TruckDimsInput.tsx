import React, { useState, useEffect } from 'react';
import { Input } from "../ui/input";

interface TruckDimsInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TruckDimsInput: React.FC<TruckDimsInputProps> = ({ value, onChange, className }) => {
  const [dimensions, setDimensions] = useState<string[]>(['', '', '']);

  useEffect(() => {
    if (value) {
      const parts = value.trim().split('x').map(v => v.trim());
      setDimensions([
        parts[0] || '',
        parts[1] || '',
        parts[2] || ''
      ]);
    } else {
      setDimensions(['', '', '']);
    }
  }, [value]);

  const handleChange = (index: number, newValue: string) => {
    const newDimensions = [...dimensions];
    newDimensions[index] = newValue.replace(/[^0-9]/g, '');
    setDimensions(newDimensions);
    onChange(newDimensions.filter(Boolean).join('x') || '');
  };

  return (
    <div className="flex space-x-1">
      {['Length', 'Width', 'Height'].map((label, index) => (
        <Input
          key={label}
          className={`
            min-w-[28px] 
            ${className}
            p-0
            text-center
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          `}
          type="text"
          maxLength={3}
          inputMode="numeric"
          pattern="[0-9]*"
          value={dimensions[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          placeholder={label}
        />
      ))}
    </div>
  );
};

export default TruckDimsInput;