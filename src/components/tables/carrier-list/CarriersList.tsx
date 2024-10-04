"use client";
// Import necessary React and Next.js types
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CarriersListAddNew from "./CarriersListAddNew";
import { CarrierData } from "@/types";
import { useState } from "react";
import { Button } from "../../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import RemoveBtn from "@/components/buttons/RemoveBtn";
import EditBtn from "@/components/buttons/EditBtn";
import SaveBtn from "@/components/buttons/SaveBtn";
import UndoBtn from "@/components/buttons/UndoBtn";

// Define the props interface that will be passed to your page component
interface TableProps {
  data: CarrierData[]; // This is the data type you expect from the backend
}

// Define the TableCarriers component to render the table
function CarriersList({ data }: TableProps) {
  const router = useRouter();
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
  const [isAddNew, setIsAddNew] = useState<boolean>(false);

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

  console.log("process.env.NEXT_PUBLIC_SERVER_URL", process.env.NEXT_PUBLIC_SERVER_URL);

  const handleUpdateCarrier = async (carrier_number: string) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carrier-list/${carrier_number}`, editingData);
      const updatedCarrierResp = response.data;
      console.log("updatedCarrierResp", updatedCarrierResp);
      setEditingRow(null);
      router.refresh();
      // Trigger revalidation after successful update
    } catch (error) {
      console.error("Update carrier error:", error);
    }
  };

  const handleRemoveCarrier = async (carrier_number: string) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carrier-list/${carrier_number}`);
      console.log("Carrier removed:", response.data);
      router.refresh();
      // Trigger revalidation after successful delete
    } catch (error) {
      console.error("Remove carrier error:", error);
    }
  };

  console.log(editingData);

  return (
    <>
      <Table className="mb-20">
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
            <TableHead colSpan={2} className="text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Iterate over the data array and render each row */}
          {data.map((item, index) => (
            <>
              {editingRow === index ? (
                <TableRow key={index}>
                  {Object.entries(editingData).map(([key, value]) => {
                    return (
                      <TableCell key={key} className={`${index % 2 === 0 ? "" : "bg-slate-300 hover:bg-slate-50"} ${editingRow === index && "bg-orange-300"}`}>
                        <input
                          className="w-full"
                          type={typeof value === "boolean" ? "checkbox" : "text"} // Correct type checking
                          defaultChecked={typeof value === "boolean" ? value : undefined} // Handle checkbox for boolean
                          value={typeof value !== "boolean" ? String(value) : undefined} // Handle string values
                          onChange={(e) => handleEditingData(index, key, e.target.type === "checkbox" ? e.target.checked : e.target.value)}
                        />
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <SaveBtn onClick={() => handleUpdateCarrier(item.carrier_number)} />
                    {/* <Button onClick={() => handleUpdateCarrier(item.carrier_number)}>Save</Button> */}
                  </TableCell>
                  <TableCell>
                    <UndoBtn onClick={() => handleUpdateCarrier("null")} />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={index} className={`${index % 2 === 0 ? "" : "bg-slate-300 hover:bg-slate-50"}`}>
                  {Object.entries(item).map(([key, value]) => {
                    return <TableCell key={key}>{value}</TableCell>;
                  })}
                  <TableCell>
                    <EditBtn onClick={() => setEditingRowHandler(index)} />
                    {/* <Button onClick={() => setEditingRowHandler(index)}>Edit</Button> */}
                  </TableCell>
                  <TableCell>
                    <RemoveBtn onClick={() => handleRemoveCarrier(item.carrier_number)} />
                    {/* <Button onClick={() => handleRemoveCarrier(item.carrier_number)}>Remove</Button> */}
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
          <TableRow>
            {/* {!isAddNew && ( */}
            <TableCell>
              <Button
                className={`$mt-4 fixed z-10 bottom-2 right-2 ${isAddNew ? "bg-red-500 hover:bg-red-700" : "bg-blue-400 hover:bg-blue-600"}`}
                onClick={() => {
                  setIsAddNew(!isAddNew);
                }}
              >
                {isAddNew ? "x" : "+"}
              </Button>
            </TableCell>
            {/* )} */}
          </TableRow>
        </TableBody>
      </Table>
      {isAddNew && <CarriersListAddNew setIsAddNew={setIsAddNew} />}
    </>
  );
}

export default CarriersList;
