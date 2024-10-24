import React, { useEffect, useRef, useState } from "react";
import { Table, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CarrierData, ColumnDef, UserData } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { columnDefinitions } from "./CarriersList";
import { CustomInput } from "@/components/chunks/CustomInput";

const initialCarrierData: CarrierData = {
  home_city: "",
  carrier_email: "",
  mc_number: "",
  company_name: "",
  company_phone: "",
  truck_type_spam: "",
  spam: false,
  active: true
};

export const columnDefinitions: ColumnDef[] = [
  { key: "home_city", type: "text", label: "Home City" },
  { key: "carrier_email", type: "email", label: "Carrier Email" },
  { key: "mc_number", type: "number", label: "MC Number" },
  { key: "company_name", type: "text", label: "Company Name" },
  { key: "company_phone", type: "phone", label: "Company Phone" },
  { key: "truck_type_spam", type: { type: "truckTypeSelect", options: ["VH", "SB"] }, label: "Truck Type" },
  { key: "spam", type: "checkbox", label: "Spam" },
  { key: "active", type: "checkbox", label: "Active" },
];


type AddCarrierProps = {
  setIsAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserData | null;
  // updatedColumnDefinitions: typeof columnDefinitions;
};

function AddCarrier({ setIsAddNew, user
  // , updatedColumnDefinitions
 }: AddCarrierProps) {
  const router = useRouter();
  const [newCarrier, setNewCarrier] = useState<CarrierData>(initialCarrierData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleAddCarrier = async () => {
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
         
            {columnDefinitions.map((columnDef) => (
              <TableHead key={columnDef.key}>{columnDef.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableRow>
          {columnDefinitions.map((columnDef) => (
            <TableCell key={columnDef.key}>
              <CustomInput
                columnDef={columnDef}
                value={newCarrier[columnDef.key as keyof CarrierData]}
                onChange={(value) => {
                  const updatedFields = { [columnDef.key]: value };
                  setNewCarrier((prev) => ({ ...prev, ...updatedFields }));
                }}
              />
            </TableCell>
          ))}

          <TableCell>
            <Button className="w-full" onClick={handleAddCarrier} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </TableCell>
        </TableRow>
      </Table>
    </div>
  );
}

export default AddCarrier;
