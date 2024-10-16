import React, { useState, useEffect, useRef } from "react";
import { Table, TableCaption, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { splitDimensions } from "@/lib/utils";

// Update the TruckData type to match your component's needs
export type TruckData = {
  id: number;
  truck_number: number;
  carrier_number: number;
  truck_type: "VH" | "SB";
  truck_dims: string;
  payload: number;
  accessories: string;
  driver_number: number;
  Driver_name: string;
};

// Create a separate type for the form state
type TruckDataForm = Omit<TruckData, 'id'>;

const initialTruckData: TruckDataForm = {
  truck_number: 0,
  carrier_number: 0,
  truck_type: "VH",
  truck_dims: "",
  payload: 0,
  accessories: "",
  driver_number: 0,
  Driver_name: "",
};

type TruckListAddNewProps = {
  setIsAddNew: React.Dispatch<React.SetStateAction<boolean>>;
};

function TruckListAddNew({ setIsAddNew }: TruckListAddNewProps) {
  const router = useRouter();
  const [newTruck, setNewTruck] = useState<TruckDataForm>(initialTruckData);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (key: keyof TruckDataForm, value: string | number) => {
    setNewTruck((prevState) => ({
      ...prevState,
      [key]: key === "truck_type" ? (value as "VH" | "SB") : 
             (key === "truck_number" || key === "carrier_number" || key === "driver_number" || key === "payload") ? Number(value) : 
             value,
    }));
  };

  const handleAddNewTruck = async () => {
    console.log("Adding new truck:", newTruck);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/truck-list`, newTruck);
      console.log("New truck added:", response.data);
      setNewTruck(initialTruckData);
      setIsAddNew(false);
      router.refresh();
    } catch (error) {
      console.error("Error adding new truck:", error);
    }
  };

  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const allAccessories = [
    "E-track", "Liftgate", "Straps", "Blankets", "Ramps", "Pallet Jack",
    "Load Bars", "Chains", "Tarps", "Dunnage", "Corner Protectors", "Winch",
    "Load Lock", "Rope", "Bungee Cords", "Cargo Net", "Dock Plates",
    "Wheel Chocks", "Hand Truck", "Dolly", "Forklift", "Pallet",
    "Shrink Wrap", "Moving Blankets", "Tie Downs", "Cargo Bars",
    "Refrigeration Unit",
  ];

  return (
    <div ref={componentRef}>
      <Table>
        <TableCaption>Add a new truck</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Truck Number</TableHead>
            <TableHead>Carrier Number</TableHead>
            <TableHead>Truck Type</TableHead>
            <TableHead>Truck Dimensions</TableHead>
            <TableHead>Payload</TableHead>
            <TableHead>Accessories</TableHead>
            <TableHead>Driver Number</TableHead>
            <TableHead>Driver Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <input type="number" value={newTruck.truck_number || ""} onChange={(e) => handleInputChange("truck_number", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell>
            <TableCell>
              <input type="number" value={newTruck.carrier_number || ""} onChange={(e) => handleInputChange("carrier_number", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell>
            <TableCell>
              <Select value={newTruck.truck_type} onValueChange={(value: "VH" | "SB") => handleInputChange("truck_type", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select truck type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VH">VH</SelectItem>
                  <SelectItem value="SB">SB</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <div className="flex space-x-1">
                <input
                  type="text"
                  value={splitDimensions(newTruck.truck_dims)[0]}
                  onChange={(e) => {
                    const [, width, height] = splitDimensions(newTruck.truck_dims);
                    handleInputChange("truck_dims", `${e.target.value}x${width}x${height}`);
                  }}
                  className="w-1/3 p-1 border rounded"
                  placeholder="Length"
                />
                <input
                  type="text"
                  value={splitDimensions(newTruck.truck_dims)[1]}
                  onChange={(e) => {
                    const [length, , height] = splitDimensions(newTruck.truck_dims);
                    handleInputChange("truck_dims", `${length}x${e.target.value}x${height}`);
                  }}
                  className="w-1/3 p-1 border rounded"
                  placeholder="Width"
                />
                <input
                  type="text"
                  value={splitDimensions(newTruck.truck_dims)[2]}
                  onChange={(e) => {
                    const [length, width] = splitDimensions(newTruck.truck_dims);
                    handleInputChange("truck_dims", `${length}x${width}x${e.target.value}`);
                  }}
                  className="w-1/3 p-1 border rounded"
                  placeholder="Height"
                />
              </div>
            </TableCell>
            <TableCell>
              <input type="number" value={newTruck.payload || ""} onChange={(e) => handleInputChange("payload", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                {allAccessories.map((accessory) => (
                  <label key={accessory} className="flex items-center space-x-2">
                    <Checkbox
                      checked={newTruck.accessories.includes(accessory)}
                      onCheckedChange={(checked) => {
                        const currentAccessories = newTruck.accessories.split(", ").filter(Boolean);
                        const newAccessories = checked ? [...currentAccessories, accessory] : currentAccessories.filter((a) => a !== accessory);
                        handleInputChange("accessories", newAccessories.join(", "));
                      }}
                    />
                    <span>{accessory}</span>
                  </label>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <input type="number" value={newTruck.driver_number || ""} onChange={(e) => handleInputChange("driver_number", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell>
            <TableCell>
              <input type="text" value={newTruck.Driver_name} onChange={(e) => handleInputChange("Driver_name", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={() => setIsAddNew(false)}>Cancel</Button>
        <Button onClick={handleAddNewTruck}>Add Truck</Button>
      </div>
    </div>
  );
}

export default TruckListAddNew;