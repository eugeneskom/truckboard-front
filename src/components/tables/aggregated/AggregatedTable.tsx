import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { debounce } from "lodash";
import { Calendar } from "@/components/ui/calendar";
import format from "date-fns/format";
import { parsePhoneNumber, AsYouType } from "libphonenumber-js";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import TruckDimsInput from "@/components/chunks/TruckDimsInput";
import { SearchRateType } from "@/types";



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
const columnDefinitions: ColumnDef[] = [
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
  { key: "carrier_id", type: "readonly", label: "Carrier ID" },
  { key: "truck_dims", type: "truckDims", label: "Truck Dimensions" },
  // { key: "company_name", type: "readonly", label: "Carrier Name" },
  { key: "late_pick_up", type: { type: "latePickupSelect", options: ["morning", "afternoon"] }, label: "Late Pickup" },
  { key: "home_city", type: "text", label: "Home City" },
  { key: "carrier_email", type: "email", label: "Carrier Email" },
  { key: "mc_number", type: "text", label: "MC Number" },
  { key: "company_name", type: "text", label: "Company Name" },
  { key: "company_phone", type: "phone", label: "Company Phone" },
  { key: "agent_id", type: "number", label: "Agent ID" },
  { key: "agent_name", type: "text", label: "Agent Name" },
  { key: "agent_email", type: "email", label: "Agent Email" },
  { key: "truck_id", type: "number", label: "Truck ID" },
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

const MIN_WIDTH_INPUT = "min-w-[150px]"; // Adjust this value as needed
const SMALL_WIDTH_INPUT = "min-w-[75px]";

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
      return <div className={`${MIN_WIDTH_INPUT} p-2 bg-gray-100 rounded`}>{value}</div>;
    case "date":
      console.log("CustomInput value: ", value);
      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className={`w-full h-full min-h-[2.5rem] flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-100 ${MIN_WIDTH_INPUT}`} onClick={() => setIsOpen(true)}>
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
        <div className={MIN_WIDTH_INPUT}>
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
        <div className={MIN_WIDTH_INPUT}>
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
        <div className={MIN_WIDTH_INPUT}>
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
              <div className={MIN_WIDTH_INPUT}>
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
              <div className={MIN_WIDTH_INPUT}>
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

interface AggregatedDataTableProps {
  data: SearchRateType[];
  setData: React.Dispatch<React.SetStateAction<SearchRateType[]>>;
}

const AggregatedDataTable: React.FC<AggregatedDataTableProps> = ({ data, setData }) => {
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: string } | null>(null);
  const [newSearchData, setNewSearchData] = useState<Partial<SearchRateType>>({});
  const [carriers, setCarriers] = useState<{ id: number; company_name: string }[]>([]);
  const [drivers, setDrivers] = useState<{ id: number; name: string; lastname: string }[]>([]);
  const [localData, setLocalData] = useState<SearchRateType[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<number | null>(null);
  const [updatedColumnDefinitions, setUpdatedColumnDefinitions] = useState(columnDefinitions);

  useEffect(() => {
    const carrierOptions = carriers.map((carrier) => ({ id: carrier.id, name: carrier.company_name }));
    const driverOptions = drivers.map((driver) => ({ id: driver.id, name: `${driver.name} ${driver.lastname}` }));

    setUpdatedColumnDefinitions(
      columnDefinitions.map((col) => {
        if (col.key === "carrier_id" && typeof col.type === "object" && col.type.type === "carrierSelect") {
          return { ...col, type: { ...col.type, options: carrierOptions } };
        }
        if (col.key === "driver_id" && typeof col.type === "object" && col.type.type === "driverSelect") {
          return { ...col, type: { ...col.type, options: driverOptions } };
        }
        return col;
      })
    );
  }, [carriers, drivers]);

  useEffect(() => {
    console.log("AggregatedDataTable data: ", data);
    setLocalData(data);
  }, [data]);

  const debouncedUpdate = useCallback(
    // eslint-disable-next-line
    debounce(async (rowIndex: number, field: string, value: any) => {
      const row = localData[rowIndex];
      let table: string;
      let id: number | undefined;

      if (["pu_city", "destination", "late_pick_up", "pu_date_start", "pu_date_end", "del_date_start", "del_date_end", "carrier_id", "truck_id", "driver_id"].includes(field)) {
        table = "searches";
        id = row.search_id;
        value = value !== "" ? value.split("T")[0] : null;
      } else if (["dead_head", "min_miles", "max_miles", "rpm", "min_rate", "round_to", "extra"].includes(field)) {
        table = "rates";
        id = row.search_id; // Assuming rates have their own ID
      } else if (["home_city", "carrier_email", "mc_number", "company_name", "company_phone"].includes(field)) {
        table = "carriers";
        id = row.carrier_id;
      } else if (["agent_id", "agent_name", "agent_email"].includes(field)) {
        table = "agents";
        id = row.agent_id;
      } else if (["truck_number", "truck_type", "truck_dims", "payload", "accessories"].includes(field)) {
        table = "trucks";
        id = row.truck_id;
      } else if (["driver_name", "driver_lastname", "driver_phone", "driver_email", "perks"].includes(field)) {
        table = "drivers";
        id = row.driver_id;
      } else {
        console.error("Unknown field:", field);
        return;
      }

      if (id === undefined) {
        console.error("Unable to determine ID for table:", table);
        return;
      }

      try {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/update-data`, { table, id, field, value });
        setData(localData);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }, 500),
    [localData, setData]
  );
  // eslint-disable-next-line
  const handleUpdate = (rowIndex: number, field: string, value: any) => {
    const newData = [...localData];
    // eslint-disable-next-line
    (newData[rowIndex] as any)[field] = value;
    setLocalData(newData);

    if (field === "truck_dims") {
      // Ensure the value is in the correct format
      const dims = value
        .split("x")
        .map((v:string) => v.trim())
        .filter((v:string) => v !== "");
      if (dims.length === 3) {
        // eslint-disable-next-line
        (newData[rowIndex] as any)[field] = dims.join("x");
      } else {
        console.error("Invalid truck dimensions:", value);
        return;
      }
    } else {
      // eslint-disable-next-line
      (newData[rowIndex] as any)[field] = value;
    }

    if (field === "company_phone" || field === "driver_phone") {
      try {
        const phoneNumber = parsePhoneNumber(value, "US");
        if (phoneNumber && phoneNumber.isValid()) {
          debouncedUpdate(rowIndex, field, phoneNumber.number);
        }
        // eslint-disable-next-line
      } catch (error: any) {
        console.error("Invalid phone number:", value);
      }
    } else {
      debouncedUpdate(rowIndex, field, value);
    }
  };

  const handleDelete = async (searchNumber: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}api/searches/${searchNumber}`);
      const newData = localData.filter((row) => row.search_id !== searchNumber);
      setLocalData(newData);
      setData(newData);
    } catch (error) {
      console.error("Error deleting search:", error);
    }
  };

  const fetchCarriers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers`);
      setCarriers(response.data);
    } catch (error) {
      console.error("Error fetching carriers:", error);
    }
  };

  const fetchDrivers = async (carrierId: number) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}api/drivers`, {
        params: { carrierId },
      });
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const handleCarrierChange = (value: string) => {
    const carrierId = parseInt(value);
    setSelectedCarrier(carrierId);
    setNewSearchData({ ...newSearchData, carrier_id: carrierId, driver_id: undefined });
    fetchDrivers(carrierId);
  };

  const handleDriverChange = (value: string) => {
    setNewSearchData({ ...newSearchData, driver_id: parseInt(value) });
  };

  const handleNewSearch = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/searches`, newSearchData);
      const updatedData = [...localData, response.data];
      setLocalData(updatedData);
      setData(updatedData);
      setNewSearchData({});
      setSelectedCarrier(null);
      setDrivers([]);
    } catch (error) {
      console.error("Error creating new search:", error);
    }
  };

  return (
    <>
      <Table>
        <TableCaption>Aggregated Search and Rate Data</TableCaption>
        <TableHeader>
          <TableRow>
            {updatedColumnDefinitions.map((columnDef) => (
              <TableHead key={columnDef.key}>{columnDef.label}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localData.length > 0 ? (
            localData.map((row, rowIndex) => (
              <TableRow key={row.search_id}>
                {updatedColumnDefinitions.map((columnDef) => (
                  <TableCell key={columnDef.key}>
                    <CustomInput
                      columnDef={columnDef}
                      value={row[columnDef.key]}
                      onChange={(value) => handleUpdate(rowIndex, columnDef.key, value)}
                      onFocus={() => setEditingCell({ rowIndex, field: columnDef.key })}
                      onBlur={() => setEditingCell(null)}
                      className={editingCell?.rowIndex === rowIndex && editingCell?.field === columnDef.key ? "bg-blue-100" : ""}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => handleDelete(row.search_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={updatedColumnDefinitions.length + 1}>No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={fetchCarriers}>New Search</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Search</DialogTitle>
          </DialogHeader>
          <Select onValueChange={handleCarrierChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a carrier" />
            </SelectTrigger>
            <SelectContent>
              {carriers.map((carrier) => (
                <SelectItem key={carrier.id} value={carrier.id.toString()}>
                  {carrier.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleDriverChange} disabled={!selectedCarrier}>
            <SelectTrigger>
              <SelectValue placeholder={selectedCarrier ? "Select a driver" : "Select a carrier first"} />
            </SelectTrigger>
            <SelectContent>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id.toString()}>{`${driver.name} ${driver.lastname}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Pickup City" onChange={(e) => setNewSearchData({ ...newSearchData, pu_city: e.target.value })} />
          <Input placeholder="Destination" onChange={(e) => setNewSearchData({ ...newSearchData, destination: e.target.value })} />
          <Button onClick={handleNewSearch}>Create Search</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AggregatedDataTable;
