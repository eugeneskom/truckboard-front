import React, { useEffect, useRef, useState } from "react";
import { Table, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CarrierData, UserData } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";

const initialCarrierData: CarrierData = {
  agent_id: 0,
  home_city: "",
  carrier_email: "",
  mc_number: "",
  company_name: "",
  company_phone: "",
  truck_type_spam: "",
  spam: false,
  driver_count: 0,
  truck_count: 0,
};

type CarriersListAddNewProps = {
  setIsAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserData;
};

function CarriersListAddNew({ setIsAddNew, user }: CarriersListAddNewProps) {
  const router = useRouter();
  const [newCarrier, setNewCarrier] = useState<CarrierData>({
    ...initialCarrierData,
    agent_id: user && user.id ? Number(user.id) : 0,
  });

  const componentRef = useRef<HTMLDivElement>(null);
  console.log('newCarrier',newCarrier, user)
  const handleInputChange = (key: keyof CarrierData, value: string | boolean) => {
    setNewCarrier((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleAddNewCarrier = async () => {
    try {
      const newCarrierUpdate = { ...newCarrier, agent_id: Number(user.id) };
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers`, newCarrierUpdate);
      console.log("New carrier added:", response.data);
      setNewCarrier(initialCarrierData);
      setIsAddNew(false);
      router.refresh();
    } catch (error) {
      console.error("Error adding new carrier:", error);
    }
  };

   // Scroll the component into view when it's rendered
   useEffect(() => {
    if (componentRef.current) {
      componentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);


  if(!user) return null;

  return (
    <div ref={componentRef}>
    <Table >
      <TableCaption>Fill out carriers info</TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead>Carrier Number</TableHead> */}
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
      <TableRow>
        {Object.entries(newCarrier).map(([key, value]) => (
          <TableCell key={key}>
            <input
              type={typeof value === "boolean" ? "checkbox" : "text"}
              checked={typeof value === "boolean" ? value : undefined}
              value={typeof value !== "boolean" ? value : undefined}
              onChange={(e) => handleInputChange(key as keyof CarrierData, e.target.type === "checkbox" ? e.target.checked : e.target.value)}
              className="w-full p-1 border rounded"
            />
            {key}
          </TableCell>
        ))}

        <TableCell>
          <Button className="w-full" onClick={handleAddNewCarrier}>
            Save
          </Button>
        </TableCell>
      </TableRow>

    </Table>
    </div>
  );
}

export default CarriersListAddNew;
