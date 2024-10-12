import { AsYouType, parsePhoneNumber } from "libphonenumber-js";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import TruckDimsInput from "./TruckDimsInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import format from "date-fns/format";
import { ColumnDef } from "@/types";
import { Checkbox } from "../ui/checkbox";

interface CustomInputProps {
  columnDef: ColumnDef;
  // eslint-disable-next-line
  value: any;
  // eslint-disable-next-line
  onChange: (value: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

const MIDDLE_WIDTH_INPUT = "min-w-[150px]";
const SMALL_WIDTH_INPUT = "min-w-[90px]";

export const CustomInput: React.FC<CustomInputProps> = ({ columnDef, value, onChange, onFocus, onBlur, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatPhoneNumber = (input: string | undefined | null) => {
    if (!input) return "";
    try {
      const phoneNumber = parsePhoneNumber(input, "US");
      if (phoneNumber) {
        return phoneNumber.format("NATIONAL");
      }
    } catch (error) {
      // If parsing fails, fall back to incomplete formatting
    }
    return new AsYouType("US").input(input);
  };

  const handlePhoneChange = (input: string) => {
    const formatter = new AsYouType("US");
    const formattedNumber = formatter.input(input);
    onChange(formattedNumber);
  };

  switch (columnDef.type) {
    case "readonly":
      return <div className={`${MIDDLE_WIDTH_INPUT} p-2 bg-gray-100 rounded`}>{value ?? ''}</div>;
    case "date":
      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className={`w-full h-full min-h-[2.5rem] flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-100 ${MIDDLE_WIDTH_INPUT}`} onClick={() => setIsOpen(true)}>
              {value ? <span>{format(new Date(value), "yyyy-MM-dd")}</span> : <span className="text-gray-400">Select date</span>}
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => {
                onChange(date?.toISOString() ?? null);
                setIsOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    case "email":
      return (
        <div className={MIDDLE_WIDTH_INPUT}>
          <Input type="email" value={value ?? ''} onChange={(e) => onChange(e.target.value || null)} onFocus={onFocus} onBlur={onBlur} className={className} />
        </div>
      );
    case "number":
      return (
        <div className={SMALL_WIDTH_INPUT}>
          <Input
            type="number"
            value={value ?? ''}
            onChange={(e) => {
              const newValue = e.target.valueAsNumber;
              onChange(!isNaN(newValue) ? newValue : null);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            className={`${className} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
        </div>
      );
    case "phone":
      return (
        <div className={MIDDLE_WIDTH_INPUT}>
          <Input
            type="tel"
            value={formatPhoneNumber(value)}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onFocus={onFocus}
            className={className}
            onBlur={(e) => {
              const phoneNumber = parsePhoneNumber(e.target.value, "US");
              if (phoneNumber) {
                onChange(phoneNumber.format("NATIONAL"));
              } else {
                onChange(null);
              }
              onBlur?.();
            }}
            placeholder="(123) 456-7890"
          />
        </div>
      );
    case "truckDims":
      return (
        <div className={MIDDLE_WIDTH_INPUT}>
          <TruckDimsInput value={value || ""} onChange={onChange} className={className} />
        </div>
      );
    case "checkbox":
      return (
        <div className={MIDDLE_WIDTH_INPUT}>
          <Checkbox
            checked={value ?? false}
            onCheckedChange={(checked) => {
              onChange(checked);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            className={className}
          />
        </div>
      );
    default:
      if (typeof columnDef.type === "object" && "type" in columnDef.type) {
        switch (columnDef.type.type) {
          case "select":
          case "truckTypeSelect":
          case "latePickupSelect":
            return (
              <div className={MIDDLE_WIDTH_INPUT}>
                <Select onValueChange={onChange} value={value ?? undefined}>
                  <SelectTrigger className={className}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {columnDef.type.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          case "carrierSelect":
          case "driverSelect":
            return (
              <div className={MIDDLE_WIDTH_INPUT}>
                <Select onValueChange={onChange} value={value?.toString() ?? undefined}>
                  <SelectTrigger className={className}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {columnDef.type.options.map((option) => (
                      <SelectItem key={option.id} value={option.id.toString()}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
        }
      }
      return (
        <div className={SMALL_WIDTH_INPUT}>
          <Input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value || null)} onFocus={onFocus} onBlur={onBlur} className={className} />
        </div>
      );
  }
};
