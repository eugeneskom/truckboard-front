"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import RemoveBtn from "@/components/buttons/RemoveBtn";
import EditBtn from "@/components/buttons/EditBtn";
import SaveBtn from "@/components/buttons/SaveBtn";
import UndoBtn from "@/components/buttons/UndoBtn";
import RateListAddNew from './RateListAddNew';
import { RateItem } from '@/types';



interface RateListProps {
  data: RateItem[];
}

function RateList({ data }: RateListProps) {
  const router = useRouter();
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<RateItem>({
    id: 0,
    search_id: 0,
    dead_head: 0,
    min_miles: 0,
    max_miles: 0,
    RPM: 0,
    min_rate: 0,
    round_to: 0,
    extra: 0,
  });
  const [isAddNew, setIsAddNew] = useState<boolean>(false);

  const setEditingRowHandler = (index: number) => {
    setEditingRow(index);
    setEditingData(data[index]);
  };

  const handleEditingData = (index: number, key: string, value: string | number) => {
    setEditingData((prevState) => ({
      ...prevState,
      [key]: key === 'search_id' ? value : Number(value),
    }));
  };

  const handleUpdateRate = async (id: number) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/rate-list/${id}`, editingData);
      console.log("Updated rate:", response.data);
      setEditingRow(null);
      router.refresh();
    } catch (error) {
      console.error("Update rate error:", error);
    }
  };

  const handleRemoveRate = async (id: number) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}api/rate-list/${id}`);
      console.log("Rate removed:", response.data);
      router.refresh();
    } catch (error) {
      console.error("Remove rate error:", error);
    }
  };

  return (
    <>
      <Table className="mb-20">
        <TableCaption>A list of rates.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Rate Number</TableHead>
            <TableHead>Search Number</TableHead>
            <TableHead>Dead head</TableHead>
            <TableHead>Min Miles</TableHead>
            <TableHead>Max Miles</TableHead>
            <TableHead>RPM</TableHead>
            <TableHead>Min Rate</TableHead>
            <TableHead>Round to</TableHead>
            <TableHead>Extra</TableHead>
            <TableHead colSpan={2} className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <React.Fragment key={item.id}>
              {editingRow === index ? (
                <TableRow>
                  {Object.entries(editingData).map(([key, value]) => (
                    key !== 'id' && (
                      <TableCell key={key} className={`${editingRow === index ? "bg-orange-300" : ""}`}>
                        <input
                          className="w-full"
                          type="text"
                          value={value}
                          onChange={(e) => handleEditingData(index, key, e.target.value)}
                        />
                      </TableCell>
                    )
                  ))}
                  <TableCell>
                    <SaveBtn onClick={() => handleUpdateRate(item.id)} />
                  </TableCell>
                  <TableCell>
                    <UndoBtn onClick={() => setEditingRow(null)} />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  {Object.entries(item).map(([key, value]) => (
                    key !== 'id' && <TableCell key={key}>{value}</TableCell>
                  ))}
                  <TableCell>
                    <EditBtn onClick={() => setEditingRowHandler(index)} />
                  </TableCell>
                  <TableCell>
                    <RemoveBtn onClick={() => handleRemoveRate(item.id)} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <Button
        className={`mt-4 fixed z-10 bottom-2 right-2 ${isAddNew ? "bg-red-500 hover:bg-red-700" : "bg-blue-400 hover:bg-blue-600"}`}
        onClick={() => setIsAddNew(!isAddNew)}
      >
        {isAddNew ? "x" : "+"}
      </Button>
      {isAddNew && <RateListAddNew setIsAddNew={setIsAddNew} />}
    </>
  );
}

export default RateList;