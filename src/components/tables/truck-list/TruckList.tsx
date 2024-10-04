"use client";
import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import TruckListAddNew from "./TruckListAddNew";
import { TruckData } from "@/types";
import { splitDimensions } from "@/lib/utils";
import EditBtn from "@/components/buttons/EditBtn";
import SaveBtn from "@/components/buttons/SaveBtn";
import RemoveBtn from "@/components/buttons/RemoveBtn";
import UndoBtn from "@/components/buttons/UndoBtn";

interface TableProps {
  data: TruckData[];
}

function TruckList({ data }: TableProps) {
  const router = useRouter();
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<TruckData | null>(null);
  const [isAddNew, setIsAddNew] = useState<boolean>(false);

  const allAccessories = [
    "E-track",
    "Liftgate",
    "Straps",
    "Blankets",
    "Ramps",
    "Pallet Jack",
    "Load Bars",
    "Dolly",
    "Forklift",
    "Pallet",
    "Shrink Wrap",
    "Moving Blankets",
  ];

  const setEditingRowHandler = (index: number) => {
    setEditingRow(index);
    setEditingData(data[index]);
  };


  

  const handleEditingData = (key: keyof TruckData, value: string | number | string[]) => {
    if (editingData) {
      setEditingData((prevState) => ({
        ...prevState!,
        [key]: key === "accessories" 
          ? (Array.isArray(value) ? value : parseAccessories(value as string))
          : key === "truck_type" 
          ? (value as "VH" | "SB") 
          : key === "truck_number" || key === "carrier_number" || key === "driver_number" || key === "payload" 
          ? Number(value) 
          : value,
      }));
    }
  };


  
  const handleUpdateTruck = async (id: number) => {
    try {
      const dataToUpdate = {
        ...editingData,
        accessories: Array.isArray(editingData?.accessories) 
          ? editingData.accessories.join(', ')
          : editingData?.accessories
      };
      const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/truck-list/${id}`, dataToUpdate);
      console.log("updatedTruckResp", response.data);
      setEditingRow(null);
      router.refresh();
    } catch (error) {
      console.error("Update truck error:", error);
    }
  };

  const handleRemoveTruck = async (id: number) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}api/truck-list/${id}`);
      console.log("Truck removed:", response.data);
      router.refresh();
    } catch (error) {
      console.error("Remove truck error:", error);
    }
  };


  const parseAccessories = (accessories: string | string[]): string[] => {
    if (Array.isArray(accessories)) {
      return accessories;
    }
    if (typeof accessories === 'string') {
      // Remove any surrounding quotes and then split
      return accessories.replace(/^"|"$/g, '').split(',').map(item => item.trim()).filter(Boolean);
    }
    return [];
  };

  const renderAccessories = (accessories: string | string[], isEditing: boolean, onChange?: (value: string[]) => void) => {
    const parsedAccessories = parseAccessories(accessories);
    return (
      <div className="flex flex-wrap gap-2">
        {allAccessories.map((accessory) => (
          <label key={accessory} className="flex items-center space-x-2">
            <Checkbox
              checked={parsedAccessories.includes(accessory)}
              onCheckedChange={(checked) => {
                if (isEditing && onChange) {
                  const newAccessories = checked 
                    ? [...parsedAccessories, accessory] 
                    : parsedAccessories.filter((a) => a !== accessory);
                  onChange(newAccessories);
                }
              }}
              disabled={!isEditing}
            />
            <span>{accessory}</span>
          </label>
        ))}
      </div>
    );
  };
  
  return (
    <>
      <Table>
        <TableCaption>A list of trucks.</TableCaption>
        <TableHeader className="text-center">
          <TableRow>
            <TableHead>Truck Number</TableHead>
            <TableHead>Carrier Number</TableHead>
            <TableHead>Truck Type</TableHead>
            <TableHead>Truck Dimensions</TableHead>
            <TableHead>Payload</TableHead>
            <TableHead>Accessories</TableHead>
            <TableHead>Driver Number</TableHead>
            <TableHead>Driver Name</TableHead>
            <TableHead colSpan={2} className="text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id} className={`${index % 2 === 0 ? "" : "bg-slate-100"}`}>
              {editingRow === index ? (
                <>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="number" value={editingData?.truck_number} onChange={(e) => handleEditingData("truck_number", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="number" value={editingData?.carrier_number} onChange={(e) => handleEditingData("carrier_number", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    
                    <Select value={editingData?.truck_type} onValueChange={(value) => handleEditingData("truck_type", value as "VH" | "SB")}>
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
                        className="w-1/3 p-1 border rounded"
                        type="text"
                        value={splitDimensions(editingData?.truck_dims || "")[0]}
                        onChange={(e) => {
                          const [, width, height] = splitDimensions(editingData?.truck_dims || "");
                          handleEditingData("truck_dims", `${e.target.value}x${width}x${height}`);
                        }}
                        placeholder="Length"
                      />
                      <input
                        className="w-1/3 p-1 border rounded"
                        type="text"
                        value={splitDimensions(editingData?.truck_dims || "")[1]}
                        onChange={(e) => {
                          const [length, , height] = splitDimensions(editingData?.truck_dims || "");
                          handleEditingData("truck_dims", `${length}x${e.target.value}x${height}`);
                        }}
                        placeholder="Width"
                      />
                      <input
                        className="w-1/3 p-1 border rounded"
                        type="text"
                        value={splitDimensions(editingData?.truck_dims || "")[2]}
                        onChange={(e) => {
                          const [length, width] = splitDimensions(editingData?.truck_dims || "");
                          handleEditingData("truck_dims", `${length}x${width}x${e.target.value}`);
                        }}
                        placeholder="Height"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="number" value={editingData?.payload} onChange={(e) => handleEditingData("payload", e.target.value)} />
                  </TableCell>
                  <TableCell>{renderAccessories(editingData?.accessories || [], true, (newAccessories) => handleEditingData("accessories", newAccessories))}</TableCell>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="number" value={editingData?.driver_number} onChange={(e) => handleEditingData("driver_number", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="text" value={editingData?.Driver_name} onChange={(e) => handleEditingData("Driver_name", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <SaveBtn onClick={() => handleUpdateTruck(item.id)} />
                    {/* <Button onClick={() => handleUpdateTruck(item.id)}>Save</Button> */}
                  </TableCell>
                  <TableCell>
                    <UndoBtn onClick={() => setEditingRow(null)} />
                    {/* <Button onClick={() => setEditingRow(null)}>Cancel</Button> */}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{item.truck_number}</TableCell>
                  <TableCell>{item.carrier_number}</TableCell>
                  <TableCell>{item.truck_type}</TableCell>
                  <TableCell>{item.truck_dims}</TableCell>
                  <TableCell>{item.payload}</TableCell>
                  <TableCell>{parseAccessories(item.accessories).join(", ")}</TableCell>
                  <TableCell>{item.driver_number}</TableCell>
                  <TableCell>{item.Driver_name}</TableCell>
                  <TableCell>
                    <EditBtn onClick={() => setEditingRowHandler(index)} />
                    {/* <Button onClick={() => setEditingRowHandler(index)}>Edit</Button> */}
                  </TableCell>
                  <TableCell>
                    <RemoveBtn onClick={() => handleRemoveTruck(item.id)} />
                    {/* <Button onClick={() => handleRemoveTruck(item.id)}>Remove</Button> */}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button className={`$mt-4 fixed bottom-2 right-2 ${isAddNew ? "bg-red-500 hover:bg-red-700" : "bg-blue-400 hover:bg-blue-600"}`} onClick={() => setIsAddNew(!isAddNew)}>
        {isAddNew ? "x" : "+"}
      </Button>
      {/* <AddBtn isAddNew={isAddNew} onClick={() => setIsAddNew(!isAddNew)} className={`$mt-4 fixed bottom-2 right-2 ${isAddNew ? "bg-red-500 hover:bg-red-700" : "bg-blue-400 hover:bg-blue-600"}`} /> */}

      {isAddNew && <TruckListAddNew setIsAddNew={setIsAddNew} />}
    </>
  );
}

export default TruckList;
