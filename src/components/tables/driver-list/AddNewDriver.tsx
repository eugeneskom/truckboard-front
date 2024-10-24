"use client";
import React, { useState, useEffect, useRef } from "react";
import { Table, TableCaption, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DriverData } from "@/types";

const initialDriverData: DriverData = {
  id: 0,
  carrier_id: 0,
  truck_id: 0,
  name: "",
  lastname: "",
  phone: "",
  email: "",
  perks: "",
};

type AddNewDriverProps = {
  setIsAddNew: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddNewDriver({ setIsAddNew }: AddNewDriverProps) {
  const router = useRouter();
  const [newDriver, setNewDriver] = useState<DriverData>(initialDriverData);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (key: keyof DriverData, value: string | number) => {
    setNewDriver((prevState) => ({
      ...prevState,
      [key]: key === "id" || key === "carrier_id" ? Number(value) : value,
    }));
  };

  const handleAddNewDriver = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/driver-list`, newDriver);
      console.log("New driver added:", response.data);
      setNewDriver(initialDriverData);
      setIsAddNew(false);
      router.refresh();
    } catch (error) {
      console.error("Error adding new driver:", error);
    }
  };

  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div ref={componentRef}>
      <Table>
        <TableCaption>Add a new driver</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Driver Number</TableHead> */}
            <TableHead>Carrier Number</TableHead>
            <TableHead>Driver Name</TableHead>
            <TableHead>Driver Last Name</TableHead>
            <TableHead>Driver Phone</TableHead>
            <TableHead>Driver Email</TableHead>
            <TableHead>Perks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {/* <TableCell>
              <input type="number" value={newDriver.driver_number || ""} onChange={(e) => handleInputChange("driver_number", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell> */}
            <TableCell>
              <input type="number" value={newDriver.carrier_id || ""} onChange={(e) => handleInputChange("carrier_id", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell>
            <TableCell>
              <input type="text" value={newDriver.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell>
            <TableCell>
              <input type="text" value={newDriver.lastname} onChange={(e) => handleInputChange("lastname", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell>
            <TableCell>
              <input type="text" value={newDriver.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell>
            <TableCell>
              <input type="email" value={newDriver.email} onChange={(e) => handleInputChange("email", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell>
            <TableCell>
              <input type="text" value={newDriver.perks} onChange={(e) => handleInputChange("perks", e.target.value)} className="w-full p-1 border rounded" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={() => setIsAddNew(false)}>Cancel</Button>
        <Button onClick={handleAddNewDriver}>Add Driver</Button>
      </div>
    </div>
  );
}

export default AddNewDriver;