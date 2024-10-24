import { parsePhoneNumber } from "libphonenumber-js";
import { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import TruckDimsInput from "./TruckDimsInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ColumnDef, UsCity } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { format, parseISO, startOfDay } from "date-fns";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { debounce } from "lodash";

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

// const MIDDLE_WIDTH_INPUT = "min-w-[150px]";
// const SMALL_WIDTH_INPUT = "min-w-[90px]";

const WIDTH_XSS = "w-8"; // 32px
const WIDTH_SM = "w-20"; // 80px

// Function to strip non-digits and limit to 10 digits
const stripAndLimitPhoneNumber = (input: string): string => {
  // Remove all non-digit characters
  let digits = input.replace(/\D/g, "");

  // Remove +1 prefix if present
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }

  // Limit to 10 digits
  return digits.slice(0, 10);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  const date = parseISO(dateString);
  return format(date, "yyyy-MM-dd");
};

// Function to format phone number for display
const formatPhoneNumberForDisplay = (input: string | number | undefined | null): string => {
  // Convert input to string and remove non-digit characters
  const digits = String(input || "").replace(/\D/g, "");

  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const CustomInput: React.FC<CustomInputProps> = ({ columnDef, value, onChange, onFocus, onBlur, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(formatPhoneNumberForDisplay(value || ""));
  const [citySearchOpen, setCitySearchOpen] = useState(false);
  const [cityResults, setCityResults] = useState<UsCity[]>([]);
  
  const handleCitySelect = (result: UsCity) => {
    onChange(`${result.city}, ${result.state_short}`);
    setCitySearchOpen(false);
    setCityResults([]);
  };
  
  const handleCitySearch = async (term: string) => {
    // If term is empty or too short, clear results and return
    if (!term || term.length < 3) {
      setCityResults([]);
      return;
    }
  
    const searchType = /^\d+$/.test(term) ? "zip" : "city";
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}api/search/${searchType}/${term}`
      );
      if (!response.ok) throw new Error("Error fetching data");
      const data = await response.json();
      setCityResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("City search error:", error);
      setCityResults([]);
    }
  };
  
  const renderCityInput = () => {
    return (
      <Popover open={citySearchOpen} onOpenChange={setCitySearchOpen}>
        <PopoverTrigger asChild>
          <div className={`${columnDef.key === "pu_city" ? "w-24" : "w-80"}`}>
            <Input
              value={value || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                onChange(newValue);
                handleCitySearch(newValue);
              }}
              onFocus={() => {
                onFocus?.();
                setCitySearchOpen(true);
              }}
              className={className}
              placeholder={columnDef.key === "pu_city" ? "Enter city" : "Enter destination"}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search cities..." 
              value={value || ""} 
              onValueChange={(newValue) => {
                onChange(newValue);
                handleCitySearch(newValue);
              }}
            />
            <CommandEmpty>No cities found</CommandEmpty>
            <CommandGroup>
              {cityResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleCitySelect(result)}
                  className="cursor-pointer"
                >
                  {`${result.city}, ${result.state_short} - ${result.zip_codes}`}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const handlePhoneChange = (input: string) => {
    const digits = stripAndLimitPhoneNumber(input);
    const formattedNumber = formatPhoneNumberForDisplay(digits);
    setDisplayValue(formattedNumber);
    onChange(digits); // Store only digits in the state
  };

  switch (columnDef.type) {
    case "readonly":
      // ${MIDDLE_WIDTH_INPUT}
      return (
        <div
          className={`${columnDef.label === ""}
        p-2 bg-gray-100 rounded`}
        >
          {value ?? ""}
        </div>
      );
    case "date":
      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div
              //  ${MIDDLE_WIDTH_INPUT}
              className={`${WIDTH_SM} h-full min-h-[2.5rem] flex items-center justify-between py-1  cursor-pointer hover:bg-gray-100
               `}
              onClick={() => setIsOpen(true)}
            >
              {value ? <span>{formatDate(value)}</span> : <span className="text-gray-400">Select date</span>}
              {/* <CalendarIcon className="h-4 w-4 opacity-50" /> */}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? parseISO(value) : undefined}
              onSelect={(date) => {
                if (date) {
                  const localDate = startOfDay(date);
                  onChange(format(localDate, "yyyy-MM-dd"));
                } else {
                  onChange(null);
                }
                setIsOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );

    case "email":
      return (
        <div className={`w-36`}>
          <Input type="email" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} onFocus={onFocus} onBlur={onBlur} className={`${className}`} />
        </div>
      );
    case "number":
      const INPUT_WIDTH = columnDef.key === "dead_head" || "min_miles" || "max_miles" ? WIDTH_XSS : WIDTH_SM;
      return (
        <div
          // className={SMALL_WIDTH_INPUT}
          className={INPUT_WIDTH}
        >
          <Input
            type="number"
            value={value ?? ""}
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
        <div className={`w-28`}>
          <Input
            type="tel"
            value={displayValue}
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
        <div
        // className={MIDDLE_WIDTH_INPUT}
        >
          <TruckDimsInput value={value || ""} onChange={onChange} className={className} />
        </div>
      );
    case "checkbox":
      return (
        <div
        // className={SMALL_WIDTH_INPUT}
        >
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
              <div
              // className={SMALL_WIDTH_INPUT}
              >
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
              <div
              // className={MIDDLE_WIDTH_INPUT}
              >
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
      } else if (columnDef.key === "pu_city") {
        return renderCityInput();
      } else {
        const WIDTH =
          columnDef.key === "mc_number"
            ? WIDTH_SM
            : // : columnDef.key === "pu_city"
            // ? "w-24"
            columnDef.key === "destination"
            ? "w-80"
            : columnDef.key === "agent_name"
            ? "w-16"
            : "w-24";
        return (
          <div className={WIDTH}>
            <Input type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} onFocus={onFocus} onBlur={onBlur} className={className} />
          </div>
        );
      }
  }
};
