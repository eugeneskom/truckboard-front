"use client";
// Import necessary React and Next.js types
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CarriersListAddNew from "./AddNewCarrier";
import { CarrierData, DriverData, TruckData, UserData } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import RemoveBtn from "@/components/buttons/RemoveBtn";
import EditBtn from "@/components/buttons/EditBtn";
import SaveBtn from "@/components/buttons/SaveBtn";
import UndoBtn from "@/components/buttons/UndoBtn";
import AddTruck from "@/components/buttons/AddTruck";
import ExistingTrucks from "./ExistingTrucks";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import ExistingDrivers from "./ExistingDrivers";
// import AddTruckNdriver from "./AddTruckNdriver";
import AddTruckNdriver from "./AddTruckNdriver";

// Define the props interface that will be passed to your page component
interface TableProps {
  data: CarrierData[]; // This is the data type you expect from the backend
}

// Define the TableCarriers component to render the table
function CarriersList({ data }: TableProps) {
  const router = useRouter();
  const [editingRow, setEditingRow] = useState<number | null>(null);
  // const user = window.localStorage.getItem("user") ? JSON.parse(window.localStorage.getItem("user") || "") : null;
  const [user, setUser] = useState<UserData | null>(null);
  const [editingData, setEditingData] = useState<CarrierData>({
    id: 0,
    home_city: "",
    carrier_email: "",
    mc_number: "",
    company_name: "",
    company_phone: "",
    truck_type_spam: "",
    spam: false,
    user_id: user ? user.id : 0,
    // truck_count: 0,
    // driver_count: 0,
  });
 

  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const [isAddTruck, setIsAddTruck] = useState<number | undefined | string>(0);
  const [carrierTrucks, setCarrierTrucks] = useState<TruckData[]>([]);
  const [carriersDrivers, setCarriersDrivers] = useState<DriverData[]>([]);
  // console.log("editingData", editingData, carrierTrucks, carriersDrivers);

  useEffect(() => {
    // Only run this code on the client
    const storedUser = window.localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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


  const handleUpdateCarrier = async (id: number | undefined | string) => {
    if (!id) return setEditingRow(null);
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers/${id}`, editingData);
      // const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carrier-list/${id}`, editingData);
      const updatedCarrierResp = response.data;
      console.log("updatedCarrierResp", updatedCarrierResp);
      setEditingRow(null);
      router.refresh();
      // Trigger revalidation after successful update
    } catch (error) {
      console.error("Update carrier error:", error);
    }
  };

  const handleRemoveCarrier = async (id: number | string | undefined) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers/${id}`);
      console.log("Carrier Removed: ", response.data);
      router.refresh();
      // Trigger revalidation after successful delete
    } catch (error) {
      console.error("Remove carrier error:", error);
    }
  };


  const handleGetTrucksByCarrier = async (id: number | string | undefined) => {
    if (!id) return console.log("handleGetTrucksByCarrier no id : ", id);
    try {
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers/${id}/details`);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers/${id}/details`);

      console.log("Trucks by carrier:", response.data);

      if (response.data) {
        setCarrierTrucks(response.data.trucks);
        setCarriersDrivers(response.data.drivers);
      }
    } catch (error) {
      console.error("Get trucks by carrier error:", error);
    }
  };

  const handleFetchTrucks = async (id: number | undefined | string) => {
    if (!id) return;
    setIsAddTruck(id);
    handleGetTrucksByCarrier(id);
  };

  return (
    <>
      <Table className="mb-20">
        <TableCaption>A list of carriers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Carrier Id</TableHead>
            {/* <TableHead>Agent Number</TableHead> */}
            <TableHead>Home City</TableHead>
            <TableHead>Carrier Email</TableHead>
            <TableHead>MC Number</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Company Phone</TableHead>
            <TableHead>Truck Type Spam</TableHead>
            <TableHead>Spam</TableHead>
            <TableHead>Drivers </TableHead>
            <TableHead>Trucks</TableHead>
            <TableHead colSpan={2} className="text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Iterate over the data array and render each row */}
          {data.map((item: CarrierData, index: number) => (
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
                    <SaveBtn onClick={() => handleUpdateCarrier(item.id)} />
                    {/* <Button onClick={() => handleUpdateCarrier(item.id)}>Save</Button> */}
                  </TableCell>
                  <TableCell>
                    <UndoBtn onClick={() => handleUpdateCarrier(0)} />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  <TableRow key={index} className={`${index % 2 === 0 ? "" : "bg-slate-300 hover:bg-slate-50"}`}>
                    {Object.entries(item).map(([key, value]) => {
                      return <TableCell key={key}>{value}</TableCell>;
                    })}
                    <TableCell>
                      <EditBtn onClick={() => setEditingRowHandler(index)} />
                    </TableCell>
                    <TableCell>
                      <RemoveBtn onClick={() => handleRemoveCarrier(item.id)} />
                    </TableCell>
                    <TableCell>
                      <AddTruck onClick={() => handleFetchTrucks(item.id)} />
                    </TableCell>
                  </TableRow>
                  {isAddTruck === item.id && item.id != undefined && (
                    <>
                      <AddTruckNdriver setIsAddTruck={setIsAddTruck} item={item} carriersDrivers={carriersDrivers} carrierTrucks={carrierTrucks} />
                      
                      <TableRow>
                        <TableCell colSpan={6}>
                          <ExistingTrucks carrierTrucks={carrierTrucks} carriersDrivers={carriersDrivers} onUpdate={() => console.log("Updated carrier details")} />
                        </TableCell>
                        <TableCell colSpan={6}>
                          <ExistingTrucks carrierTrucks={carrierTrucks} carriersDrivers={carriersDrivers} onUpdate={() => console.log("Updated carrier details")} />
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </>
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
      {isAddNew && <CarriersListAddNew setIsAddNew={setIsAddNew} user={user} />}
    </>
  );
}

export default CarriersList;
