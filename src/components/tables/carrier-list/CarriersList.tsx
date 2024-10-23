"use client";
// Import necessary React and Next.js types
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddCarrier from "./AddCarrier";
import { CarrierData, ColumnDef, DriverData, TruckData, UserData } from "@/types";
import {
  Fragment,
  useCallback,
  useEffect,
  // useMemo,
  useState,
} from "react";
import { Button } from "../../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import RemoveBtn from "@/components/buttons/RemoveBtn";
// import EditBtn from "@/components/buttons/EditBtn";
// import SaveBtn from "@/components/buttons/SaveBtn";
// import UndoBtn from "@/components/buttons/UndoBtn";
import AddTruck from "@/components/buttons/AddTruck";
import ExistingTrucks from "./ExistingTrucks";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import ExistingDrivers from "./ExistingDrivers";
// import AddTruckNdriver from "./AddTruckNdriver";
import AddTruckNdriver from "./AddTruckNdriver";
import { CustomInput } from "@/components/chunks/CustomInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExistingDrivers from "./ExistingDrivers";
import { useAuth } from "@/hooks/useAuth";
// import ExistingDrivers from "./ExistingDrivers";
// import { debounce } from "lodash";

export const columnDefinitions: ColumnDef[] = [
  { key: "home_city", type: "readonly", label: "Home City" },
  { key: "carrier_email", type: "readonly", label: "Carrier Email" },
  { key: "mc_number", type: "readonly", label: "MC Number" },
  { key: "company_name", type: "readonly", label: "Company Name" },
  { key: "company_phone", type: "phone", label: "Company Phone" },
  { key: "truck_type_spam", type: { type: "truckTypeSelect", options: ["VH", "SB"] }, label: "Truck Type" },
  { key: "spam", type: "checkbox", label: "Spam" },
];

// Define the props interface that will be passed to your page component
interface TableProps {
  data: CarrierData[]; // This is the data type you expect from the backend
}

// Define the TableCarriers component to render the table
function CarriersList({ data }: TableProps) {
  const router = useRouter();
  const { user } = useAuth() as { user: UserData | null };
  console.log("CarriersList user: ", user);
  // const [user, setUser] = useState<UserData | null>(null);
  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const [isAddTruck, setIsAddTruck] = useState<number | undefined | string>(0);
  const [carrierTrucks, setCarrierTrucks] = useState<TruckData[]>([]);
  const [carriersDrivers, setCarriersDrivers] = useState<DriverData[]>([]);
  const [localData, setLocalData] = useState<CarrierData[]>([]);
  const [updatedColumnDefinitions] = useState(columnDefinitions);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: string } | null>(null);
  const [filterOption, setFilterOption] = useState<string>("all");

  // Function to filter carriers based on the selected option
  const filterCarriers = () => {
    if (filterOption === "mine" && user?.id) {
      setLocalData(data.filter((carrier) => carrier.user_id === user.id));
    } else {
      setLocalData(data); // Show all carriers if "All" is selected
    }
  };

  // Trigger the filtering function when filterOption changes
  useEffect(() => {
    filterCarriers();
  }, [filterOption, data, user]);

  // useEffect(() => {
  //   const storedUser = window.localStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setLocalData(data);
    }
  }, [data]);

  // console.log("localData: ", localData);

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

      // console.log("Trucks by carrier:", response.data);

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

  const handleUpdate = useCallback(
    async (rowIndex: number, updatedFields: Partial<CarrierData>) => {
      if (rowIndex < 0 || rowIndex >= localData.length) {
        console.error("Invalid row index:", rowIndex);
        return;
      }

      const row = localData[rowIndex];
      if (!row || !row.id) {
        console.error("Invalid row data:", row);
        return;
      }

      const updatedRow = { ...row, ...updatedFields };
      setLocalData((prevData) => prevData.map((item, index) => (index === rowIndex ? updatedRow : item)));

      try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers/${row.id}`, updatedRow);
        if (response.status === 200) {
          setLocalData((prevData) => prevData.map((item, index) => (index === rowIndex ? updatedRow : item)));
          console.log(`Updated carrier ${row.id}`);
        }
      } catch (error) {
        console.error("Error updating data:", error);
        setLocalData((prevData) => [...prevData]);
      }
    },
    [localData]
  );

  if (!localData || localData.length === 0) {
    return <div className="min-h-[90vh] flex justify-center items-center">Loading...</div>;
  }

  return (
    <>
      <Select onValueChange={(value) => setFilterOption(value)} defaultValue="all">
        <SelectTrigger  className="w-48 ml-3 mb-3">
          <SelectValue placeholder="Filter carriers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="mine">Mine</SelectItem>
        </SelectContent>
      </Select>
      <Table className="mb-20">
        <TableCaption>A list of carriers.</TableCaption>
        <TableHeader>
          <TableRow>
            {updatedColumnDefinitions.map((columnDef) => (
              <TableHead key={columnDef.key}>{columnDef.label}</TableHead>
            ))}
            <TableHead colSpan={1} className="text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localData ? (
            localData.map((row: CarrierData, rowIndex: number) => (
              <Fragment key={row.id}>
                <TableRow key={row.id}>
                  {updatedColumnDefinitions.map((columnDef) => (
                    <TableCell key={columnDef.key}>
                      <CustomInput
                        columnDef={columnDef}
                        value={row ? row[columnDef.key as keyof CarrierData] : ""}
                        onChange={(value) => {
                          if (row && row.id) {
                            const updatedFields = { [columnDef.key]: value };
                            handleUpdate(rowIndex, updatedFields);
                          } else {
                            console.error("Cannot update: Invalid row data", row);
                          }
                        }}
                        onFocus={() => setEditingCell({ rowIndex, field: columnDef.key })}
                        onBlur={() => setEditingCell(null)}
                        className={editingCell?.rowIndex === rowIndex && editingCell?.field === columnDef.key ? "bg-blue-100" : ""}
                      />
                    </TableCell>
                  ))}

                  <TableCell>
                    <RemoveBtn onClick={() => handleRemoveCarrier(row.id)} />
                  </TableCell>
                  <TableCell>
                    <AddTruck onClick={() => handleFetchTrucks(row.id)} />
                  </TableCell>
                </TableRow>

                {isAddTruck === row.id && row.id != undefined && (
                  <Fragment key={row.id}>
                    <AddTruckNdriver setIsAddTruck={setIsAddTruck} item={row} carriersDrivers={carriersDrivers} carrierTrucks={carrierTrucks} />
                    <TableRow>
                      <TableCell colSpan={6}>
                        <ExistingTrucks carrierTrucks={carrierTrucks} carriersDrivers={carriersDrivers} onUpdate={() => console.log("Updated carrier details")} />
                      </TableCell>
                      <TableCell colSpan={6}>
                        <ExistingDrivers carriersDrivers={carriersDrivers} carrierTrucks={carrierTrucks} />
                      </TableCell>
                    </TableRow>
                  </Fragment>
                )}
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={updatedColumnDefinitions.length}>No data available</TableCell>
            </TableRow>
          )}
          <TableRow>
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
      {isAddNew  && <AddCarrier setIsAddNew={setIsAddNew} user={user} updatedColumnDefinitions={updatedColumnDefinitions} />}
    </>
  );
}

export default CarriersList;
