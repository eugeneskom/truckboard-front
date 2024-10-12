import { SearchRateType } from "@/types";
import { AsYouType, parsePhoneNumber } from "libphonenumber-js";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import TruckDimsInput from "./TruckDimsInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import format from "date-fns/format";


//  input types:
type InputTypes =
  | "text"
  | "date"
  | "email"
  | "number"
  | "readonly"
  | "phone"
  | "truckDims"
  | { type: "select"; options: string[] }
  | { type: "truckTypeSelect"; options: string[] }
  | { type: "carrierSelect"; options: { id: number; name: string }[] }
  | { type: "driverSelect"; options: { id: number; name: string }[] }
  | { type: "latePickupSelect"; options: string[] };


// the structure for column definitions
interface ColumnDef {
  key: keyof SearchRateType;
  type: InputTypes;
  label: string;
}

//  Column definitions
export const columnDefinitions: ColumnDef[] = [
  { key: "search_id", type: "number", label: "Search ID" },
  { key: "pu_city", type: "text", label: "Pickup City" },
  { key: "destination", type: "text", label: "Destination" },
  { key: "pu_date_start", type: "date", label: "Pickup Start Date" },
  { key: "pu_date_end", type: "date", label: "Pickup End Date" },
  { key: "del_date_start", type: "date", label: "Delivery Start Date" },
  { key: "del_date_end", type: "date", label: "Delivery End Date" },
  { key: "dead_head", type: "number", label: "Dead Head" },
  { key: "min_miles", type: "number", label: "Min Miles" },
  { key: "max_miles", type: "number", label: "Max Miles" },
  { key: "rpm", type: "number", label: "RPM" },
  { key: "min_rate", type: "number", label: "Min Rate" },
  { key: "round_to", type: "number", label: "Round To" },
  { key: "extra", type: "number", label: "Extra" },
  // { key: "carrier_id", type: "readonly", label: "Carrier ID" },
  { key: "truck_dims", type: "truckDims", label: "Truck Dimensions" },
  // { key: "company_name", type: "readonly", label: "Carrier Name" },
  { key: "late_pick_up", type: { type: "latePickupSelect", options: ["morning", "afternoon"] }, label: "Late Pickup" },
  { key: "home_city", type: "text", label: "Home City" },
  { key: "carrier_email", type: "email", label: "Carrier Email" },
  { key: "mc_number", type: "text", label: "MC Number" },
  { key: "company_name", type: "text", label: "Company Name" },
  { key: "company_phone", type: "phone", label: "Company Phone" },
  // { key: "agent_id", type: "number", label: "Agent ID" },
  { key: "agent_name", type: "text", label: "Agent Name" },
  // { key: "agent_email", type: "email", label: "Agent Email" },
  // { key: "truck_id", type: "number", label: "Truck ID" },
  { key: "truck_type", type: { type: "truckTypeSelect", options: ["VH", "SB", "DD"] }, label: "Truck Type" },
  // { key: "truck_dims", type: "text", label: "Truck Dimensions" },
  { key: "payload", type: "number", label: "Payload" },
  { key: "accessories", type: "text", label: "Accessories" },
  // { key: "driver_id", type: { type: "driverSelect", options: [] }, label: "Driver" },
  { key: "driver_name", type: "text", label: "Driver Name" },
  { key: "driver_lastname", type: "text", label: "Driver Last Name" },
  { key: "driver_phone", type: "phone", label: "Driver Phone" },
  { key: "driver_email", type: "email", label: "Driver Email" },
  { key: "perks", type: "text", label: "Perks" },
];


interface CustomInputProps {
  columnDef: ColumnDef;
  // eslint-disable-next-line
  value: any;
  // eslint-disable-next-line
  onChange: (value: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  className: string;
}

const MIDDLE_WIDTH_INPUT = "min-w-[150px]";
const SMALL_WIDTH_INPUT = "min-w-[90px]";



export const CustomInput: React.FC<CustomInputProps> = ({ columnDef, value, onChange, onFocus, onBlur, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatPhoneNumber = (input: string) => {
    if (!input) return "";
    try {
      const phoneNumber = parsePhoneNumber(input, "US");
      if (phoneNumber) {
        return phoneNumber.format("NATIONAL");
      }
      // eslint-disable-next-line
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
      return <div className={`${MIDDLE_WIDTH_INPUT} p-2 bg-gray-100 rounded`}>{value}</div>;
    case "date":
      console.log("CustomInput value: ", value);
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
                onChange(date?.toISOString() || null);
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
          <Input type="email" value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFocus} onBlur={onBlur} className={className} />
        </div>
      );
    case "number":
      return (
        <div className={SMALL_WIDTH_INPUT}>
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              const newValue = e.target.valueAsNumber;
              if (!isNaN(newValue) && newValue >= 0) {
                onChange(newValue);
              }
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            className={`${className} [appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
          `}
            min={0}
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
            className={`${className}`}
            onBlur={(e) => {
              const phoneNumber = parsePhoneNumber(e.target.value, "US");
              if (phoneNumber) {
                onChange(phoneNumber.format("NATIONAL"));
              }
              onBlur();
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
    default:
      if (typeof columnDef.type === "object" && "type" in columnDef.type) {
        switch (columnDef.type.type) {
          case "select":
          case "truckTypeSelect":
          case "latePickupSelect":
            return (
              <div className={MIDDLE_WIDTH_INPUT}>
                <Select onValueChange={onChange} defaultValue={value}>
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
                <Select onValueChange={onChange} defaultValue={value?.toString()}>
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
          <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFocus} onBlur={onBlur} className={className} />
        </div>
      );
  }
};