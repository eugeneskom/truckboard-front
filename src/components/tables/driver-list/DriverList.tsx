"use client";
import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import DriverListAddNew from "./DriverListAddNew";
import { DriverData } from "@/types";
import EditBtn from "@/components/buttons/EditBtn";
import SaveBtn from "@/components/buttons/SaveBtn";
import RemoveBtn from "@/components/buttons/RemoveBtn";
import UndoBtn from "@/components/buttons/UndoBtn";

interface TableProps {
  data: DriverData[];
}

function DriverList({ data }: TableProps) {
  const router = useRouter();
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<DriverData | null>(null);
  const [isAddNew, setIsAddNew] = useState<boolean>(false);

  console.log("DriverList", data);

  const setEditingRowHandler = (index: number) => {
    setEditingRow(index);
    setEditingData(data[index]);
  };

  const handleEditingData = (key: keyof DriverData, value: string | number) => {
    if (editingData) {
      setEditingData((prevState) => ({
        ...prevState!,
        [key]: key === "id" || key === "carrier_id" 
          ? Number(value) 
          : value,
      }));
    }
  };

  const handleUpdateDriver = async (id: number) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/drivers/${id}`, editingData);
      console.log("updatedDriverResp", response.data);
      setEditingRow(null);
      router.refresh();
    } catch (error) {
      console.error("Update driver error:", error);
    }
  };

  const handleRemoveDriver = async (id: number) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}api/drivers/${id}`);
      console.log("Driver removed:", response.data);
      router.refresh();
    } catch (error) {
      console.error("Remove driver error:", error);
    }
  };

  return (
    <>
      <Table>
        <TableCaption>A list of drivers.</TableCaption>
        <TableHeader className="text-center">
          <TableRow>
            <TableHead>Driver Number</TableHead>
            <TableHead>Carrier Number</TableHead>
            <TableHead>Driver Name</TableHead>
            <TableHead>Driver Last Name</TableHead>
            <TableHead>Driver Phone</TableHead>
            <TableHead>Driver Email</TableHead>
            <TableHead>Perks</TableHead>
            <TableHead colSpan={2} className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id} className={`${index % 2 === 0 ? "" : "bg-slate-100"}`}>
              {editingRow === index ? (
                <>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="number" value={editingData?.id} onChange={(e) => handleEditingData("id", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="number" value={editingData?.carrier_id} onChange={(e) => handleEditingData("carrier_id", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="text" value={editingData?.name} onChange={(e) => handleEditingData("name", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="text" value={editingData?.lastname} onChange={(e) => handleEditingData("lastname", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="text" value={editingData?.phone} onChange={(e) => handleEditingData("phone", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="email" value={editingData?.email} onChange={(e) => handleEditingData("email", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <input className="w-full p-1 border rounded" type="text" value={editingData?.perks} onChange={(e) => handleEditingData("perks", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <SaveBtn onClick={() => handleUpdateDriver(item.id)} />
                  </TableCell>
                  <TableCell>
                    <UndoBtn onClick={() => setEditingRow(null)} />
                    {/* <Button onClick={() => setEditingRow(null)}>Cancel</Button> */}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.carrier_id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.lastname}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.perks}</TableCell>
                  <TableCell>
                    <EditBtn onClick={() => setEditingRowHandler(index)} />
                  </TableCell>
                  <TableCell>
                    <RemoveBtn onClick={() => handleRemoveDriver(item.id)} />
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
      {isAddNew && <DriverListAddNew setIsAddNew={setIsAddNew} />}
    </>
  );
}

export default DriverList;