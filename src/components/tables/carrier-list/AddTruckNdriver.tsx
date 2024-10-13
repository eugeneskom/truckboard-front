import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
// import ExistingTrucks from "./ExistingTrucks";
// import ExistingDrivers from "./ExistingDrivers";
import { CarrierData, DriverData, TruckData } from "@/types";
import { useRouter } from "next/navigation";

import axios from "axios";
import { Input } from "@/components/ui/input";
import TruckDimsInput from "@/components/chunks/TruckDimsInput";

type TruckType = "" | "VH" | "SB";

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
  const digits = String(input || "").replace(/\D/g, "");

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

  const [displayValue, setDisplayValue] = useState(formatPhoneNumberForDisplay(driverData.phone || ""));

  const handlePhoneChange = (input: string) => {
    const digits = stripAndLimitPhoneNumber(input);
    const formattedNumber = formatPhoneNumberForDisplay(digits);
    setDisplayValue(formattedNumber);
    // onChange(digits); // Store only digits in the state
  };

  const handleAddTruckNdriver = async (carrierId: string | number | undefined) => {
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
      <TableRow>
        <TableCell colSpan={3}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (item.id !== undefined) {
                handleAddTruck(item.id);
              }
            }}
            className="flex flex-col items-center gap-3 ml-5"
          >
            <h2 className="text-center mb-3">Add Truck information</h2>
            <Select onValueChange={(value: TruckType) => setTruckData((prevData) => ({ ...prevData, type: value }))} value={truckData.type}>
              <SelectTrigger>
                <SelectValue placeholder="Select truck type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VH">VH</SelectItem>
                <SelectItem value="SB">SB</SelectItem>
              </SelectContent>
            </Select>
            <TruckDimsInput value={truckData.dims} onChange={(value) => setTruckData({ ...truckData, dims: value })} />
            {/* <span>Payload:</span> */}
            <Input placeholder="Payload" type="number" value={truckData.payload ?? 0} onChange={(e) => setTruckData({ ...truckData, payload: parseInt(e.target.value) })} />
            <Input placeholder="Accessories" type="text" value={truckData.accessories ?? ""} onChange={(e) => setTruckData({ ...truckData, accessories: e.target.value })} />
            <br />
            <Button type="submit">Add Truck</Button>
          </form>
        </TableCell>
        <TableCell colSpan={3}>
          <form className="flex flex-col gap-3 items-center">
            <Input placeholder="Driver Name" type="text" value={driverData.name ?? ""} onChange={(e) => setDriverData({ ...driverData, name: e.target.value })} />
            <Input placeholder="Last Name" type="text" value={driverData.lastname ?? ""} onChange={(e) => setDriverData({ ...driverData, lastname: e.target.value })} />
            <Input type="tel" value={displayValue} onChange={(e) => handlePhoneChange(e.target.value)} placeholder="(123) 456-7890" />
            <Input placeholder="Email" type="email" value={driverData.email ?? ""} onChange={(e) => setDriverData({ ...driverData, email: e.target.value })} />
            <Input placeholder="Perks" type="text" value={driverData.perks ?? ""} onChange={(e) => setDriverData({ ...driverData, perks: e.target.value })} />
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
          </form>
        </TableCell>
      </TableRow>
  );
}

export default AddTruckNdriver;
