"use client";
import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import EditBtn from "@/components/buttons/EditBtn";
import SaveBtn from "@/components/buttons/SaveBtn";
import RemoveBtn from "@/components/buttons/RemoveBtn";
import UndoBtn from "@/components/buttons/UndoBtn";
// import { Button } from "@/components/ui/button";
import CustomDatePicker from "@/components/ui/date-picker";
import { SearchData } from "@/types";

interface TableProps {
  data: SearchData[];
}

function SearchList({ data }: TableProps) {
  const router = useRouter();
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<SearchData | null>(null);

  const setEditingRowHandler = (index: number) => {
    setEditingRow(index);
    setEditingData(data[index]);
  };

  const handleEditingData = (key: keyof SearchData, value: string | number) => {
    if (editingData) {
      setEditingData((prevState) => ({
        ...prevState!,
        [key]: key === "search_number" || key === "truck_number" ? Number(value) : value,
      }));
    }
  };

  const handleUpdateSearch = async (id: number) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/search-list/${id}`, editingData);
      console.log("updatedSearchResp", response.data);
      setEditingRow(null);
      router.refresh();
    } catch (error) {
      console.error("Update search error:", error);
    }
  };

  const handleRemoveSearch = async (id: number) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}api/search-list/${id}`);
      console.log("Search removed:", response.data);
      router.refresh();
    } catch (error) {
      console.error("Remove search error:", error);
    }
  };

  return (
    <Table>
      <TableCaption>Search List</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Search Number</TableHead>
          <TableHead>Truck Number</TableHead>
          <TableHead>PU City</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Late Pick Up</TableHead>
          <TableHead>PU Date Start</TableHead>
          <TableHead>PU Date End</TableHead>
          <TableHead>Del Date Start</TableHead>
          <TableHead>Del Date End</TableHead>
          <TableHead colSpan={2}>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.id} className={index % 2 === 0 ? "" : "bg-slate-100"}>
            {editingRow === index ? (
              <>
                <TableCell>
                  <input
                    className="w-full p-1 border rounded"
                    type="number"
                    value={editingData?.search_number}
                    onChange={(e) => handleEditingData("search_number", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    className="w-full p-1 border rounded"
                    type="number"
                    value={editingData?.truck_number}
                    onChange={(e) => handleEditingData("truck_number", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    className="w-full p-1 border rounded"
                    type="text"
                    value={editingData?.PU_City}
                    onChange={(e) => handleEditingData("PU_City", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    className="w-full p-1 border rounded"
                    type="text"
                    value={editingData?.Destination}
                    onChange={(e) => handleEditingData("Destination", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={editingData?.Late_pick_up}
                    onValueChange={(value) => handleEditingData("Late_pick_up", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <CustomDatePicker
                    selectedDate={editingData?.pu_date_start ? new Date(editingData.pu_date_start) : null}
                    onChange={(date) => handleEditingData("pu_date_start", date ? date.toISOString().split('T')[0] : '')}
                    placeholderText="Select PU start date"
                  />
                </TableCell>
                <TableCell>
                  <CustomDatePicker
                    selectedDate={editingData?.pu_date_end ? new Date(editingData.pu_date_end) : null}
                    onChange={(date) => handleEditingData("pu_date_end", date ? date.toISOString().split('T')[0] : '')}
                    placeholderText="Select PU end date"
                  />
                </TableCell>
                <TableCell>
                  <CustomDatePicker
                    selectedDate={editingData?.del_date_start ? new Date(editingData.del_date_start) : null}
                    onChange={(date) => handleEditingData("del_date_start", date ? date.toISOString().split('T')[0] : '')}
                    placeholderText="Select Del start date"
                  />
                </TableCell>
                <TableCell>
                  <CustomDatePicker
                    selectedDate={editingData?.del_date_end ? new Date(editingData.del_date_end) : null}
                    onChange={(date) => handleEditingData("del_date_end", date ? date.toISOString().split('T')[0] : '')}
                    placeholderText="Select Del end date"
                  />
                </TableCell>
                <TableCell>
                  <SaveBtn onClick={() => handleUpdateSearch(item.id)} />
                </TableCell>
                <TableCell>
                  <UndoBtn onClick={() => setEditingRow(null)} />
                </TableCell>
              </>
            ) : (
              <>
                <TableCell>{item.search_number}</TableCell>
                <TableCell>{item.truck_number}</TableCell>
                <TableCell>{item.PU_City}</TableCell>
                <TableCell>{item.Destination}</TableCell>
                <TableCell>{item.Late_pick_up}</TableCell>
                <TableCell>{item.pu_date_start}</TableCell>
                <TableCell>{item.pu_date_end}</TableCell>
                <TableCell>{item.del_date_start}</TableCell>
                <TableCell>{item.del_date_end}</TableCell>
                <TableCell>
                  <EditBtn onClick={() => setEditingRowHandler(index)} />
                </TableCell>
                <TableCell>
                  <RemoveBtn onClick={() => handleRemoveSearch(item.id)} />
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default SearchList;