"use client";
// Import necessary React and Next.js types
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CarrierData } from "@/types";
import { useState } from "react";
import { Button } from "./ui/button";

// Define the props interface that will be passed to your page component
interface TableProps {
  data: CarrierData[]; // This is the data type you expect from the backend
}

// Define the TableCarriers component to render the table
function TableCarriers({ data }: TableProps) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<CarrierData>({
    carrier_number: "",
    agent_number: "",
    home_city: "",
    carrier_email: "",
    mc_number: "",
    company_name: "",
    company_phone: "",
    truck_type_spam: "",
    spam: false,
  });

  const setEditingRowHandler = (index: number) => {
    setEditingRow(index);
    setEditingData(data[index]);
  };
  const handleEditingData = (index: number, key: string, value: string | boolean) => {
    setEditingData((prevState: CarrierData) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };

  console.log(editingData);

  return (
    <Table>
      <TableCaption>A list of carriers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Carrier Number</TableHead>
          <TableHead>Agent Number</TableHead>
          <TableHead>Home City</TableHead>
          <TableHead>Carrier Email</TableHead>
          <TableHead>MC Number</TableHead>
          <TableHead>Company Name</TableHead>
          <TableHead>Company Phone</TableHead>
          <TableHead>Truck Type Spam</TableHead>
          <TableHead>Spam</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Iterate over the data array and render each row */}
        {data.map((item, index) => (
          <>
            {editingRow === index ? (
              Object.entries(item).map(([key, value]) => {
                return (
                  <TableRow key={key}>
                    <TableCell key={key} className={`${index % 2 === 0 ? "" : "bg-slate-300 hover:bg-slate-50"}`}>
                      <input
                        type={typeof value === "boolean" ? "checkbox" : "text"} // Correct type checking
                        defaultChecked={typeof value === "boolean" ? value : undefined} // Handle checkbox for boolean
                        value={typeof value !== "boolean" ? String(value) : undefined} // Handle string values
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow key={index} className={`${index % 2 === 0 ? "" : "bg-slate-300 hover:bg-slate-50"}`}>
                {Object.entries(item).map(([key, value]) => {
                  return <TableCell key={key}>{value}</TableCell>;
                })}
                <TableCell>
                  <Button onClick={() => setEditingRowHandler(index)}>Edit</Button>
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
}

export default TableCarriers;
