import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { debounce } from "lodash";
// import { Calendar } from "@/components/ui/calendar";
// import format from "date-fns/format";
// import { parsePhoneNumber, AsYouType } from "libphonenumber-js";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarIcon } from "lucide-react";
// import TruckDimsInput from "@/components/chunks/TruckDimsInput";
import { SearchRateType } from "@/types";
import { useMemo } from "react";
import { columnDefinitions, CustomInput } from "@/components/chunks/CustomInput";


interface AggregatedDataTableProps {
  data: SearchRateType[];
  setData: React.Dispatch<React.SetStateAction<SearchRateType[]>>;
}

const AggregatedDataTable: React.FC<AggregatedDataTableProps> = ({ data, setData }) => {
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: string } | null>(null);
  const [newSearchData, setNewSearchData] = useState<Partial<SearchRateType>>({});
  const [carriers, setCarriers] = useState<{ id: number; company_name: string }[]>([]);
  const [drivers, setDrivers] = useState<{ id: number; name: string; lastname: string }[]>([]);
  const [localData, setLocalData] = useState<SearchRateType[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<number | null>(null);
  const [updatedColumnDefinitions, setUpdatedColumnDefinitions] = useState(columnDefinitions);

  useEffect(() => {
    const carrierOptions = carriers.map((carrier) => ({ id: carrier.id, name: carrier.company_name }));
    const driverOptions = drivers.map((driver) => ({ id: driver.id, name: `${driver.name} ${driver.lastname}` }));

    setUpdatedColumnDefinitions(
      columnDefinitions.map((col) => {
        if (col.key === "carrier_id" && typeof col.type === "object" && col.type.type === "carrierSelect") {
          return { ...col, type: { ...col.type, options: carrierOptions } };
        }
        if (col.key === "driver_id" && typeof col.type === "object" && col.type.type === "driverSelect") {
          return { ...col, type: { ...col.type, options: driverOptions } };
        }
        return col;
      })
    );
  }, [carriers, drivers]);

  useEffect(() => {
    // console.log("AggregatedDataTable data: ", data);
    setLocalData(data);
  }, [data]);

  const updateData = useCallback(
    // eslint-disable-next-line
    async (table: string, id: number, field: string, value: any) => {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/update-data`, { table, id, field, value });
        setData((prevData) => prevData.map((item) => (item.search_id === id ? { ...item, [field]: value } : item)));
      } catch (error) {
        console.error("Error updating data:", error);
      }
    },
    [setData]
  );

  const debouncedUpdate = useMemo(
    () =>
      debounce(
        // eslint-disable-next-line
        (table: string, id: number, field: string, value: any) => updateData(table, id, field, value),
        500
      ),
    [updateData]
  );
  const handleUpdate = useCallback(
    // eslint-disable-next-line
    (rowIndex: number, field: string, value: any) => {
      const row = localData[rowIndex];
      let table: string;
      let id: number | undefined;

      if (["pu_city", "destination", "late_pick_up", "pu_date_start", "pu_date_end", "del_date_start", "del_date_end", "carrier_id", "truck_id", "driver_id"].includes(field)) {
        table = "searches";
        id = row.search_id;
        value = value !== "" ? value.split("T")[0] : null;
      } else if (["dead_head", "min_miles", "max_miles", "rpm", "min_rate", "round_to", "extra"].includes(field)) {
        table = "rates";
        id = row.search_id;
      } else if (["home_city", "carrier_email", "mc_number", "company_name", "company_phone"].includes(field)) {
        table = "carriers";
        id = row.carrier_id;
      } else if (["agent_id", "agent_name", "agent_email"].includes(field)) {
        table = "agents";
        id = row.agent_id;
      } else if (["truck_number", "truck_type", "truck_dims", "payload", "accessories"].includes(field)) {
        table = "trucks";
        id = row.truck_id;
      } else if (["driver_name", "driver_lastname", "driver_phone", "driver_email", "perks"].includes(field)) {
        table = "drivers";
        id = row.driver_id;
      } else {
        console.error("Unknown field:", field);
        return;
      }

      if (id === undefined) {
        console.error("Unable to determine ID for table:", table);
        return;
      }

      setLocalData((prevData) => prevData.map((item, index) => (index === rowIndex ? { ...item, [field]: value } : item)));

      debouncedUpdate(table, id, field, value);
    },
    [localData, debouncedUpdate]
  );

  // const debouncedUpdate = useCallback(
  //   // eslint-disable-next-line
  //   debounce(async (rowIndex: number, field: string, value: any) => {
  //     const row = localData[rowIndex];
  //     let table: string;
  //     let id: number | undefined;

  //     if (["pu_city", "destination", "late_pick_up", "pu_date_start", "pu_date_end", "del_date_start", "del_date_end", "carrier_id", "truck_id", "driver_id"].includes(field)) {
  //       table = "searches";
  //       id = row.search_id;
  //       value = value !== "" ? value.split("T")[0] : null;
  //     } else if (["dead_head", "min_miles", "max_miles", "rpm", "min_rate", "round_to", "extra"].includes(field)) {
  //       table = "rates";
  //       id = row.search_id; // Assuming rates have their own ID
  //     } else if (["home_city", "carrier_email", "mc_number", "company_name", "company_phone"].includes(field)) {
  //       table = "carriers";
  //       id = row.carrier_id;
  //     } else if (["agent_id", "agent_name", "agent_email"].includes(field)) {
  //       table = "agents";
  //       id = row.agent_id;
  //     } else if (["truck_number", "truck_type", "truck_dims", "payload", "accessories"].includes(field)) {
  //       table = "trucks";
  //       id = row.truck_id;
  //     } else if (["driver_name", "driver_lastname", "driver_phone", "driver_email", "perks"].includes(field)) {
  //       table = "drivers";
  //       id = row.driver_id;
  //     } else {
  //       console.error("Unknown field:", field);
  //       return;
  //     }

  //     if (id === undefined) {
  //       console.error("Unable to determine ID for table:", table);
  //       return;
  //     }

  //     try {
  //       await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/update-data`, { table, id, field, value });
  //       setData(localData);
  //     } catch (error) {
  //       console.error("Error updating data:", error);
  //     }
  //   }, 500),
  //   [localData, setData]
  // );
  // // eslint-disable-next-line
  // const handleUpdate = (rowIndex: number, field: string, value: any) => {
  //   const newData = [...localData];
  //   // eslint-disable-next-line
  //   (newData[rowIndex] as any)[field] = value;
  //   setLocalData(newData);

  //   if (field === "truck_dims") {
  //     // Ensure the value is in the correct format
  //     const dims = value
  //       .split("x")
  //       .map((v:string) => v.trim())
  //       .filter((v:string) => v !== "");
  //     if (dims.length === 3) {
  //       // eslint-disable-next-line
  //       (newData[rowIndex] as any)[field] = dims.join("x");
  //     } else {
  //       console.error("Invalid truck dimensions:", value);
  //       return;
  //     }
  //   } else {
  //     // eslint-disable-next-line
  //     (newData[rowIndex] as any)[field] = value;
  //   }

  //   if (field === "company_phone" || field === "driver_phone") {
  //     try {
  //       const phoneNumber = parsePhoneNumber(value, "US");
  //       if (phoneNumber && phoneNumber.isValid()) {
  //         debouncedUpdate(rowIndex, field, phoneNumber.number);
  //       }
  //       // eslint-disable-next-line
  //     } catch (error: any) {
  //       console.error("Invalid phone number:", value);
  //     }
  //   } else {
  //     debouncedUpdate(rowIndex, field, value);
  //   }
  // };

  const handleDelete = async (searchNumber: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}api/searches/${searchNumber}`);
      const newData = localData.filter((row) => row.search_id !== searchNumber);
      setLocalData(newData);
      setData(newData);
    } catch (error) {
      console.error("Error deleting search:", error);
    }
  };

  const fetchCarriers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers`);
      setCarriers(response.data);
    } catch (error) {
      console.error("Error fetching carriers:", error);
    }
  };

  const fetchDrivers = async (carrierId: number) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}api/drivers`, {
        params: { carrierId },
      });
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const handleCarrierChange = (value: string) => {
    const carrierId = parseInt(value);
    setSelectedCarrier(carrierId);
    setNewSearchData({ ...newSearchData, carrier_id: carrierId, driver_id: undefined });
    fetchDrivers(carrierId);
  };

  const handleDriverChange = (value: string) => {
    setNewSearchData({ ...newSearchData, driver_id: parseInt(value) });
  };

  const handleNewSearch = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/searches`, newSearchData);
      const updatedData = [...localData, response.data];
      setLocalData(updatedData);
      setData(updatedData);
      setNewSearchData({});
      setSelectedCarrier(null);
      setDrivers([]);
    } catch (error) {
      console.error("Error creating new search:", error);
    }
  };

  return (
    <>
      <Table>
        <TableCaption>Aggregated Search and Rate Data</TableCaption>
        <TableHeader>
          <TableRow>
            {updatedColumnDefinitions.map((columnDef) => (
              <TableHead key={columnDef.key}>{columnDef.label}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localData.length > 0 ? (
            localData.map((row, rowIndex) => (
              <TableRow key={row.search_id}>
                {updatedColumnDefinitions.map((columnDef) => (
                  <TableCell key={columnDef.key}>
                    <CustomInput
                      columnDef={columnDef}
                      value={row[columnDef.key]}
                      onChange={(value) => handleUpdate(rowIndex, columnDef.key, value)}
                      onFocus={() => setEditingCell({ rowIndex, field: columnDef.key })}
                      onBlur={() => setEditingCell(null)}
                      className={editingCell?.rowIndex === rowIndex && editingCell?.field === columnDef.key ? "bg-blue-100" : ""}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => handleDelete(row.search_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={updatedColumnDefinitions.length + 1}>No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={fetchCarriers}>New Search</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Search</DialogTitle>
          </DialogHeader>
          <Select onValueChange={handleCarrierChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a carrier" />
            </SelectTrigger>
            <SelectContent>
              {carriers.map((carrier) => (
                <SelectItem key={carrier.id} value={carrier.id.toString()}>
                  {carrier.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleDriverChange} disabled={!selectedCarrier}>
            <SelectTrigger>
              <SelectValue placeholder={selectedCarrier ? "Select a driver" : "Select a carrier first"} />
            </SelectTrigger>
            <SelectContent>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id.toString()}>{`${driver.name} ${driver.lastname}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Pickup City" onChange={(e) => setNewSearchData({ ...newSearchData, pu_city: e.target.value })} />
          <Input placeholder="Destination" onChange={(e) => setNewSearchData({ ...newSearchData, destination: e.target.value })} />
          <Button onClick={handleNewSearch}>Create Search</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AggregatedDataTable;
