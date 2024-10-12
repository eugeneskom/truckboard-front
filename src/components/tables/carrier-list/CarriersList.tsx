"use client";
// Import necessary React and Next.js types
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CarriersListAddNew from "./AddNewCarrier";
import { CarrierData, ColumnDef, DriverData, TruckData, UserData } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { debounce } from "lodash";

export const columnDefinitions: ColumnDef[] = [
  { key: "home_city", type: "text", label: "Home City" },
  { key: "carrier_email", type: "email", label: "Carrier Email" },
  { key: "mc_number", type: "text", label: "MC Number" },
  { key: "company_name", type: "text", label: "Company Name" },
  { key: "company_phone", type: "phone", label: "Company Phone" },
  // { key: "agent_name", type: "text", label: "Agent Name" },
  { key: "truck_type_spam", type: { type: "truckTypeSelect", options: ["VH", "SB"] }, label: "Truck Type" },
  { key: "spam", type: "checkbox", label: "Spam" },
  // { key: "payload", type: "number", label: "Payload" },
  // { key: "accessories", type: "text", label: "Accessories" },
];

// Define the props interface that will be passed to your page component
interface TableProps {
  data: CarrierData[]; // This is the data type you expect from the backend
}

// Define the TableCarriers component to render the table
function CarriersList({ data }: TableProps) {
  const router = useRouter();
  // const [editingRow, setEditingRow] = useState<number | null>(null);
  // const user = window.localStorage.getItem("user") ? JSON.parse(window.localStorage.getItem("user") || "") : null;
  const [user, setUser] = useState<UserData | null>(null);
  // const [editingData, setEditingData] = useState<CarrierData>({
  //   id: 0,
  //   home_city: "",
  //   carrier_email: "",
  //   mc_number: "",
  //   company_name: "",
  //   company_phone: "",
  //   truck_type_spam: "",
  //   spam: false,
  //   user_id: user ? user.id : 0,
  //   // truck_count: 0,
  //   // driver_count: 0,
  // });

  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const [isAddTruck, setIsAddTruck] = useState<number | undefined | string>(0);
  const [carrierTrucks, setCarrierTrucks] = useState<TruckData[]>([]);
  const [carriersDrivers, setCarriersDrivers] = useState<DriverData[]>([]);
  // console.log("editingData", editingData, carrierTrucks, carriersDrivers);
  const [localData, setLocalData] = useState<CarrierData[]>([]);

  const [updatedColumnDefinitions] = useState(columnDefinitions);

  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: string } | null>(null);

  useEffect(() => {
    // Only run this code on the client
    const storedUser = window.localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setLocalData(data);
    }
  }, [data]);

  // const setEditingRowHandler = (index: number) => {
  //   setEditingRow(index);
  //   setEditingData(data[index]);
  // };
  // const handleEditingData = (index: number, key: string, value: string | boolean) => {
  //   setEditingData((prevState: CarrierData) => {
  //     return {
  //       ...prevState,
  //       [key]: value,
  //     };
  //   });
  // };

  // const handleUpdateCarrier = async (id: number | undefined | string) => {
  //   if (!id) return setEditingRow(null);
  //   try {
  //     const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers/${id}`, editingData);
  //     // const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carrier-list/${id}`, editingData);
  //     const updatedCarrierResp = response.data;
  //     console.log("updatedCarrierResp", updatedCarrierResp);
  //     setEditingRow(null);
  //     router.refresh();
  //     // Trigger revalidation after successful update
  //   } catch (error) {
  //     console.error("Update carrier error:", error);
  //   }
  // };

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

  // const updateData = useCallback(
  //   // eslint-disable-next-line
  //   async (table: string, id: number, field: string, value: any) => {
  //     try {
  //       await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/update-data`, { table, id, field, value });
  //       // setData((prevData) => prevData.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  //     } catch (error) {
  //       console.error("Error updating data:", error);
  //     }
  //   },
  //   []
  // );

  // const debouncedUpdate = useMemo(
  //   () =>
  //     debounce(
  //       // eslint-disable-next-line
  //       (table: string, id: number, field: string, value: any) => updateData(table, id, field, value),
  //       500
  //     ),
  //   [updateData]
  // );

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

      // Immediately update the UI
      setLocalData(prevData => prevData.map((item, index) => 
        index === rowIndex ? updatedRow : item
      ));
      try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers/${row.id}`, updatedRow);
        if (response.status === 200) {
          setLocalData((prevData) => prevData.map((item, index) => (index === rowIndex ? updatedRow : item)));
          console.log(`Updated carrier ${row.id}`);
        }
      } catch (error) {
        console.error("Error updating data:", error);
        // Optionally, you could revert the local change here
        // setLocalData(prevData => [...prevData]);
      }
    },
    [localData]
  );


  if (!localData || localData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Table className="mb-20">
        <TableCaption>A list of carriers.</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Carrier Id</TableHead> */}
            {/* <TableHead>Agent Number</TableHead> */}
            {/* <TableHead>Home City</TableHead>
            <TableHead>Carrier Email</TableHead>
            <TableHead>MC Number</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Company Phone</TableHead>
            <TableHead>Truck Type Spam</TableHead>
            <TableHead>Spam</TableHead>
            <TableHead>Drivers </TableHead>
            <TableHead>Trucks</TableHead> */}
            {updatedColumnDefinitions.map((columnDef) => (
              <TableHead key={columnDef.key}>{columnDef.label}</TableHead>
            ))}
            <TableHead colSpan={2} className="text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localData ? (
            localData.map((row: CarrierData, rowIndex: number) => (
              <>
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
                  {/* <TableCell>
                    <EditBtn onClick={() => setEditingRowHandler(rowIndex)} />
                  </TableCell> */}
                  <TableCell>
                    <RemoveBtn onClick={() => handleRemoveCarrier(row.id)} />
                  </TableCell>
                  <TableCell>
                    <AddTruck onClick={() => handleFetchTrucks(row.id)} />
                  </TableCell>
                </TableRow>

                {isAddTruck === row.id && row.id != undefined && (
                  <>
                    <AddTruckNdriver setIsAddTruck={setIsAddTruck} item={row} carriersDrivers={carriersDrivers} carrierTrucks={carrierTrucks} />

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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={updatedColumnDefinitions.length}>No data available</TableCell>
            </TableRow>
          )}

          {/* {data.map((item: CarrierData, index: number) => (
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
          ))} */}
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
