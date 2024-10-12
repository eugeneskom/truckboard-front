import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import ExistingTrucks from "./ExistingTrucks";
import ExistingDrivers from "./ExistingDrivers";
import { CarrierData, DriverData, TruckData } from "@/types";
import { useRouter } from "next/navigation";

import axios from "axios";
import { Input } from "@/components/ui/input";



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

// Function to format phone number for display
const formatPhoneNumberForDisplay = (input: string | number | undefined | null): string => {
  // Convert input to string and remove non-digit characters
  const digits = String(input || '').replace(/\D/g, '');

  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

interface AddTruckNdriverProps {
  setIsAddTruck: (id: number) => void;
  item: CarrierData;
  carrierTrucks: TruckData[];
  carriersDrivers: DriverData[];
}

function AddTruckNdriver({ setIsAddTruck, item, carriersDrivers, carrierTrucks }: AddTruckNdriverProps) {
  
  const router = useRouter();

  const [truckData, setTruckData] = useState<TruckData>({
    id: 0,
    carrier_id: 0,
    type: "",
    dims: "",
    payload: 0,
    accessories: "",
  });
  const [driverData, setDriverData] = useState<DriverData>({
    id: 0,
    carrier_id: 0,
    name: "",
    lastname: "",
    phone: "",
    email: "",
    perks: "",
    truck_id: 0,
  });

  const [displayValue, setDisplayValue] = useState(formatPhoneNumberForDisplay(value || ""));

  const handlePhoneChange = (input: string) => {
    const digits = stripAndLimitPhoneNumber(input);
    const formattedNumber = formatPhoneNumberForDisplay(digits);
    setDisplayValue(formattedNumber);
    onChange(digits); // Store only digits in the state
  };



  const handleAddTruckNdriver = async (
    carrierId: string | number | undefined
  ) => {
    if (!carrierId) return console.log("handleAddTruckNdriver no carrierId : ", carrierId);
    try {
      const params = { ...driverData, carrier_id: carrierId }; // for now set initial truck_id to 0 so it does not belong to any truck
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/drivers`, params);
      console.log("Driver added:", response.data, truckData);
      setIsAddTruck(0);
      setTruckData({
        id: 0,
        carrier_id: 0,
        type: "",
        dims: "",
        payload: 0,
        accessories: "",
      });

      router.refresh();
    } catch (error) {
      console.error("Add driver error:", error);
    }
  };

  const handleAddTruck = async (carrierId: string | number | undefined) => {
    if (!carrierId) return console.log("handleAddTruck no carrierId : ", carrierId);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/add/trucks`, {
        ...truckData,
        carrier_id: carrierId,
      });
      console.log("Truck added:", response.data, truckData);
      setIsAddTruck(0);
      setTruckData({
        id: 0,
        carrier_id: 0,
        type: "",
        dims: "",
        payload: 0,
        accessories: "",
      });

      router.refresh();
    } catch (error) {
      console.error("Add truck error:", error);
    }
  };
  
  return (
    <>
      <TableRow>
        <TableCell colSpan={6}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (item.id !== undefined) {
                handleAddTruck(item.id);
              }
            }}
          >
            <label>
              Truck Type:
              {/* <input type="text" placeholder="Type" value={truckData.type} onChange={(e) => setTruckData({ ...truckData, type: e.target.value })} /> */}
              <select onChange={(e) => setTruckData({ ...truckData, type: e.target.value as "" | "VH" | "SB" })}>
                <option value="VH">VH</option>
                <option value="SB">SB</option>
              </select>
            </label>
            <br />
            <label>
              {" "}
              Dims:
              <input type="text" placeholder="Dimensions" value={truckData.dims} onChange={(e) => setTruckData({ ...truckData, dims: e.target.value })} />
            </label>
            <br />
            <label>
              Payload:
              <input type="number" placeholder="Payload" value={truckData.payload} onChange={(e) => setTruckData({ ...truckData, payload: parseInt(e.target.value) })} />
            </label>
            <br />
            <label>
              Accessories:
              <input type="text" placeholder="Accessories" value={truckData.accessories} onChange={(e) => setTruckData({ ...truckData, accessories: e.target.value })} />
            </label>

            <br />
            <Button type="submit">Add Truck</Button>
          </form>
        </TableCell>
        <TableCell colSpan={6}>
          <Input placeholder="Driver Name" type="text" value={driverData.name ?? ""} onChange={(e) => setDriverData({ ...driverData, name: e.target.value })}  />
          <Input placeholder="Last Name" type="text" value={driverData.lastname ?? ""} onChange={(e) => setDriverData({ ...driverData, lastname: e.target.value })}  />
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
          <input type="text" placeholder="Phone Number" value={driverData.phone} onChange={(e) => setDriverData({ ...driverData, phone: e.target.value })} />
          <Input placeholder="Email" type="email" value={driverData.email ?? ""} onChange={(e) => setDriverData({ ...driverData, email: e.target.value })}  />
          <Input placeholder="Perks" type="text" value={driverData.perks ?? ""} onChange={(e) => setDriverData({ ...driverData, perks: e.target.value })}  />
          <Select onValueChange={(truckId) => setDriverData({ ...driverData, truck_id: Number(truckId) })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a truck" />
            </SelectTrigger>
            <SelectContent>
              {carrierTrucks
                .filter((truck) => !carriersDrivers.find((driver) => driver.truck_id === truck.id))
                .map((truck) => {
                  console.log("carrierTrucksMap: ", truck);
                  return truck;
                })
                .map((truck) => (
                  <SelectItem key={truck.id} value={String(truck.id)}>
                    {truck.type} (Payload : {truck.payload})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              handleAddTruckNdriver(item.id);
            }}
          >
            Add Driver
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={12}>
          <ExistingTrucks carrierTrucks={carrierTrucks} carriersDrivers={carriersDrivers} onUpdate={() => console.log("Updated carrier details")} />
          <ExistingDrivers carriersDrivers={carriersDrivers} carrierTrucks={carrierTrucks} />
        </TableCell>
      </TableRow>
    </>
  );
}

export default AddTruckNdriver;
