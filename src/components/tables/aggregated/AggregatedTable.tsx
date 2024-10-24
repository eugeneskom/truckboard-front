import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { debounce } from "lodash";
import { ColumnDef, SearchRateType, UserData, UserSettings } from "@/types";
import { useMemo } from "react";
import { CustomInput } from "@/components/chunks/CustomInput";
import { useAuth } from "@/hooks/useAuth";
import AddSearch from "./AddSearch";

import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

//  Column definitions
export const columnDefinitions: ColumnDef[] = [
  // { key: "search_id", type: "readonly", label: "Search ID" },
  { key: "posting", type: "checkbox", label: "post" },
  { key: "dat_posting", type: "checkbox", label: "DAT post" },
  { key: "call_driver", type: "checkbox", label: "Call Driver" },
  { key: "pu_city", type: "text", label: "PU City" },
  { key: "destination", type: "text", label: "Destination" },
  { key: "pu_date_start", type: "date", label: "PU Start" },
  { key: "pu_date_end", type: "date", label: "PU End" },
  { key: "del_date_start", type: "date", label: "Del Start" },
  { key: "del_date_end", type: "date", label: "Del End" },
  { key: "dead_head", type: "number", label: "DH" },
  { key: "min_miles", type: "number", label: "Min Mls" },
  { key: "max_miles", type: "number", label: "Max Mls" },
  { key: "rpm", type: "number", label: "RPM" },
  { key: "min_rate", type: "number", label: "Min Rate" },
  { key: "round_to", type: "number", label: "Round To" },
  { key: "extra", type: "number", label: "Extra" },
  { key: "truck_dims", type: "truckDims", label: "Truck dims" },
  { key: "late_pick_up", type: { type: "latePickupSelect", options: ["morning", "afternoon"] }, label: "Late PU" },
  { key: "home_city", type: "text", label: "Home City" },
  { key: "carrier_email", type: "email", label: "Carrier Email" },
  { key: "mc_number", type: "text", label: "MC" },
  { key: "company_name", type: "text", label: "Company Name" },
  { key: "company_phone", type: "phone", label: "Company Phone" },
  { key: "agent_name", type: "text", label: "Agent Name" },
  { key: "truck_type", type: { type: "truckTypeSelect", options: ["VH", "SB", "DD"] }, label: "Truck Type" },
  { key: "payload", type: "number", label: "Payload" },
  { key: "accessories", type: "text", label: "Accessories" },
  { key: "driver_name", type: "text", label: "Driver Name" },
  { key: "driver_lastname", type: "text", label: "Driver Last Name" },
  { key: "driver_phone", type: "phone", label: "Driver Phone" },
  { key: "driver_email", type: "email", label: "Driver Email" },
  { key: "perks", type: "text", label: "Perks" },
];

interface AggregatedDataTableProps {
  data: SearchRateType[];
  onLoadMore: () => void;
  // setData: React.Dispatch<React.SetStateAction<SearchRateType[]>>;
}

interface AggregatedApiResponse {
  data: SearchRateType[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalRows: number;
    hasMore: boolean;
  };
}

const AggregatedDataTable: React.FC<AggregatedDataTableProps> = ({
  data,
  onLoadMore
  // , setData
}) => {
  const { user } = useAuth() as { user: UserData | null };
  const { ref, inView } = useInView();
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: string } | null>(null);
  const [updatedColumnDefinitions, setUpdatedColumnDefinitions] = useState(columnDefinitions);
  const [localData, setLocalData] = useState<SearchRateType[]>([]);
  const [filterOption, setFilterOption] = useState<UserSettings["searchMine"]>("all");
  const [carriers, setCarriers] = useState<{ id: number; company_name: string }[]>([]);
  const [drivers, setDrivers] = useState<{ id: number; name: string; lastname: string }[]>([]);



  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["aggregatedData", filterOption],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get<AggregatedApiResponse>(`${process.env.NEXT_PUBLIC_SERVER_URL}api/aggregated`, {
        params: {
          page: pageParam,
          limit: 10,
          filter: filterOption,
          userId: filterOption === "mine" ? user?.id : undefined,
        },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: AggregatedApiResponse) => 
      lastPage.meta.hasMore ? lastPage.meta.currentPage + 1 : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
      onLoadMore();

    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  

  const allData = useMemo(() => {
    if (!infiniteData) return [];
    return infiniteData.pages.flatMap((page) => page.data).filter((item) => filterOption === "all" || (filterOption === "mine" && item.agent_id === user?.id));
  }, [infiniteData, filterOption, user]);

  console.log("allData", allData);

  console.log("filterOption", filterOption);



  useEffect(() => {
    // console.log("AggregatedDataTable data: ", data);
    setLocalData(data);
  }, [data]);

  const updateData = useCallback(
    // eslint-disable-next-line
    async (table: string, id: number, field: string, value: any) => {
      try {
        // setData((prevData) => prevData.map((item) => (item.search_id === id ? { ...item, [field]: value } : item)));
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/update-data`, { table, id, field, value });
      } catch (error) {
        console.error("Error updating data:", error);
      }
    },
    []
    // [setData]
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

      if (["posting", "dat_posting", "call_driver", "pu_city", "destination", "late_pick_up", "pu_date_start", "pu_date_end", "del_date_start", "del_date_end", "carrier_id", "truck_id", "driver_id"].includes(field)) {
        table = "searches";
        id = row.search_id;
        console.log("searches", value);
        if (field === "pu_date_start" || field === "pu_date_end" || field === "del_date_start" || field === "del_date_end") {
          value = value !== "" ? value.split("T")[0] : null;
        } else {
          // value = value !== "" ? value;
        }
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

      // setLocalData((prevData) => prevData.map((item, index) => (index === rowIndex ? { ...item, [field]: value } : item)));
      setLocalData((prevData) => {
        const start = performance.now(); // Recording the start time

        const updatedData = [...prevData];
        updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };

        const end = performance.now(); // Recording the end time
        console.log(`Time taken for setLocalData update: ${(end - start).toFixed(2)}ms`);

        return updatedData;
      });
      debouncedUpdate(table, id, field, value);
    },
    [localData, debouncedUpdate]
  );

  const handleDelete = async (searchNumber: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}api/searches/${searchNumber}`);
      const newData = localData.filter((row) => row.search_id !== searchNumber);
      setLocalData(newData);
      // setData(newData);
    } catch (error) {
      console.error("Error deleting search:", error);
    }
  };

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
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const parsedSettings: UserSettings = JSON.parse(savedSettings);
        setFilterOption(parsedSettings.searchMine);
      } catch (error) {
        console.error("Error parsing user settings:", error);
      }
    }
  }, []);

  // console.log("newSearchData", newSearchData);

  const handleFilterChange = (value: UserSettings["searchMine"]) => {
    setFilterOption(value);
    const updatedSettings: UserSettings = { searchMine: value };
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
  };

  return (
    <>
      <Select onValueChange={handleFilterChange} defaultValue="all">
        <SelectTrigger className="w-48 ml-3 mb-3">
          <SelectValue placeholder="Filter carriers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="mine">Mine</SelectItem>
        </SelectContent>
      </Select>
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
                      value={row[columnDef.key as keyof SearchRateType]}
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

          <tr ref={ref}>
            {isFetching && (
              <td colSpan={updatedColumnDefinitions.length + 1} className="text-center py-4">
                Loading more...
              </td>
            )}
          </tr>
        </TableBody>
      </Table>
      <AddSearch setLocalData={setLocalData} setCarriers={setCarriers} setDrivers={setDrivers} drivers={drivers} carriers={carriers} localData={localData} />
    </>
  );
};

export default AggregatedDataTable;
