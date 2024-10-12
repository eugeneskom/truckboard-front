import React, { useEffect, useRef, useState } from "react";
import { Table, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CarrierData, UserData } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { columnDefinitions } from "./CarriersList";
import { CustomInput } from "@/components/chunks/CustomInput";

const initialCarrierData: CarrierData = {
  home_city: "",
  carrier_email: "",
  mc_number: "",
  company_name: "",
  company_phone: "",
  truck_type_spam: "",
  spam: false,
};

type AddNewCarrierProps = {
  setIsAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserData | null;
  updatedColumnDefinitions: typeof columnDefinitions;
};

function AddNewCarrier({ setIsAddNew, user, updatedColumnDefinitions }: AddNewCarrierProps) {
  const router = useRouter();
  const [newCarrier, setNewCarrier] = useState<CarrierData>(initialCarrierData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (key: keyof CarrierData, value: string | boolean) => {
    setNewCarrier((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleAddNewCarrier = async () => {
    if (!user || !user.id) {
      setError("User information is missing. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const newCarrierUpdate = { ...newCarrier, user_id: Number(user.id) };
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers`, newCarrierUpdate);
      console.log("New carrier added:", response.data);
      setNewCarrier(initialCarrierData);
      setIsAddNew(false);
      router.refresh();
    } catch (error) {
      console.error("Error adding new carrier:", error);
      setError("Failed to add new carrier. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (!user) return null;

  return (
    <div ref={componentRef}>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Table>
        <TableCaption>Fill out carrier&apos;s info</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Home City</TableHead>
            <TableHead>Carrier Email</TableHead>
            <TableHead>MC Number</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Company Phone</TableHead>
            <TableHead>Truck Type Spam</TableHead>
            <TableHead>Spam</TableHead> */}
            {updatedColumnDefinitions.map((columnDef) => (
              <TableHead key={columnDef.key}>{columnDef.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableRow>
          {/* {Object.entries(newCarrier).map(([key, value]) => (
            <TableCell key={key}>
              <input
                type={typeof value === "boolean" ? "checkbox" : "text"}
                checked={typeof value === "boolean" ? value : undefined}
                value={typeof value !== "boolean" ? value : undefined}
                onChange={(e) => handleInputChange(key as keyof CarrierData, e.target.type === "checkbox" ? e.target.checked : e.target.value)}
                className="w-full p-1 border rounded"
              />
            </TableCell>
          ))} */}

          {updatedColumnDefinitions.map((columnDef) => (
            <TableCell key={columnDef.key}>
              <CustomInput
                columnDef={columnDef}
                value={newCarrier[columnDef.key as keyof CarrierData]}
                onChange={(value) => {
                  const updatedFields = { [columnDef.key]: value };
                  setNewCarrier((prev) => ({ ...prev, ...updatedFields }));
                }}
                // onFocus={() => setEditingCell({ rowIndex: -1, field: columnDef.key })}
                // onBlur={() => setEditingCell(null)}
                // className={editingCell?.rowIndex === -1 && editingCell?.field === columnDef.key ? "bg-blue-100" : ""}
              />
            </TableCell>
          ))}

          <TableCell>
            <Button className="w-full" onClick={handleAddNewCarrier} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </TableCell>
        </TableRow>
      </Table>
    </div>
  );
}

export default AddNewCarrier;
