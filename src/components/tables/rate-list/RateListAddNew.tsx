import React, { useState, useRef, useEffect } from "react";
import { Table, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RateItem } from "@/types";



const initialRateData: RateItem = {
  id: 0,
  rate_number: 0,
  search_number: "",
  dead_head: 0,
  min_miles: 0,
  max_miles: 0,
  RPM: 0,
  min_rate: 0,
  round_to: 0,
  extra: 0,
};

interface RateListAddNewProps {
  setIsAddNew: React.Dispatch<React.SetStateAction<boolean>>;
}

function RateListAddNew({ setIsAddNew }: RateListAddNewProps) {
  const router = useRouter();
  const [newRate, setNewRate] = useState<RateItem>(initialRateData);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (key: keyof RateItem, value: string | number) => {
    setNewRate((prevState) => ({
      ...prevState,
      [key]: key === 'search_number' ? value : Number(value),
    }));
  };

  const handleAddNewRate = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/rate-list`, newRate);
      console.log("New rate added:", response.data);
      setNewRate(initialRateData);
      setIsAddNew(false);
      router.refresh();
    } catch (error) {
      console.error("Error adding new rate:", error);
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
        <TableCaption>Add a new rate</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Rate Number</TableHead>
            <TableHead>Search Number</TableHead>
            <TableHead>Dead Head</TableHead>
            <TableHead>Min Miles</TableHead>
            <TableHead>Max Miles</TableHead>
            <TableHead>RPM</TableHead>
            <TableHead>Min Rate</TableHead>
            <TableHead>Round to</TableHead>
            <TableHead>Extra</TableHead>
          </TableRow>
        </TableHeader>
        <TableRow>
          {Object.entries(newRate).map(([key, value]) => (
            <TableCell key={key}>
              <input
                type="number"
                value={value}
                onChange={(e) => handleInputChange(key as keyof RateItem, e.target.value)}
                className="w-full p-1 border rounded"
              />
            </TableCell>
          ))}
          <TableCell>
            <Button className="w-full" onClick={handleAddNewRate}>
              Save
            </Button>
          </TableCell>
        </TableRow>
      </Table>
    </div>
  );
}

export default RateListAddNew;