import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import ExistingTrucks from "./ExistingTrucks";
import ExistingDrivers from "./ExistingDrivers";
import { CarrierData, DriverData, TruckData } from "@/types";
import { useRouter } from "next/navigation";

import axios from "axios";



interface AddTruckNdriverProps {
  setIsAddTruck: (id: number) => void;
  item: CarrierData;
  carrierTrucks: TruckData[];
  carriersDrivers: DriverData[];
}

function AddTruckNdriver({ setIsAddTruck, item, carriersDrivers, carrierTrucks }: AddTruckNdriverProps) {
  
  const router = useRouter();

  const [truckData, setTruckData] = useState<TruckData>({
    id: 0,
    carrier_id: 0,
    type: "",
    dims: "",
    payload: 0,
    accessories: "",
  });
  const [driverData, setDriverData] = useState<DriverData>({
    id: 0,
    carrier_id: 0,
    name: "",
    lastname: "",
    phone: "",
    email: "",
    perks: "",
    truck_id: 0,
  });

  const handleAddTruckNdriver = async (
    carrierId: string | number | undefined
  ) => {
    if (!carrierId) return console.log("handleAddTruckNdriver no carrierId : ", carrierId);
    try {
      const params = { ...driverData, carrier_id: carrierId }; // for now set initial truck_id to 0 so it does not belong to any truck
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/drivers`, params);
      console.log("Driver added:", response.data, truckData);
      setIsAddTruck(0);
      setTruckData({
        id: 0,
        carrier_id: 0,
        type: "",
        dims: "",
        payload: 0,
        accessories: "",
      });

      router.refresh();
    } catch (error) {
      console.error("Add driver error:", error);
    }
  };

  const handleAddTruck = async (carrierId: string | number | undefined) => {
    if (!carrierId) return console.log("handleAddTruck no carrierId : ", carrierId);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/add/trucks`, {
        ...truckData,
        carrier_id: carrierId,
      });
      console.log("Truck added:", response.data, truckData);
      setIsAddTruck(0);
      setTruckData({
        id: 0,
        carrier_id: 0,
        type: "",
        dims: "",
        payload: 0,
        accessories: "",
      });

      router.refresh();
    } catch (error) {
      console.error("Add truck error:", error);
    }
  };
  
  return (
    <>
      <TableRow>
        <TableCell colSpan={6}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (item.id !== undefined) {
                handleAddTruck(item.id);
              }
            }}
          >
            <label>
              Truck Type:
              {/* <input type="text" placeholder="Type" value={truckData.type} onChange={(e) => setTruckData({ ...truckData, type: e.target.value })} /> */}
              <select onChange={(e) => setTruckData({ ...truckData, type: e.target.value as "" | "VH" | "SB" })}>
                <option value="VH">VH</option>
                <option value="SB">SB</option>
              </select>
            </label>
            <br />
            <label>
              {" "}
              Dims:
              <input type="text" placeholder="Dimensions" value={truckData.dims} onChange={(e) => setTruckData({ ...truckData, dims: e.target.value })} />
            </label>
            <br />
            <label>
              Payload:
              <input type="number" placeholder="Payload" value={truckData.payload} onChange={(e) => setTruckData({ ...truckData, payload: parseInt(e.target.value) })} />
            </label>
            <br />
            <label>
              Accessories:
              <input type="text" placeholder="Accessories" value={truckData.accessories} onChange={(e) => setTruckData({ ...truckData, accessories: e.target.value })} />
            </label>

            <br />
            <Button type="submit">Add Truck</Button>
          </form>
        </TableCell>
        <TableCell colSpan={6}>
          <input type="text" placeholder="Driver Name" value={driverData.name} onChange={(e) => setDriverData({ ...driverData, name: e.target.value })} />
          <input type="text" placeholder="Last Name" value={driverData.lastname} onChange={(e) => setDriverData({ ...driverData, lastname: e.target.value })} />
          <input type="text" placeholder="Phone Number" value={driverData.phone} onChange={(e) => setDriverData({ ...driverData, phone: e.target.value })} />
          <input type="email" placeholder="Email" value={driverData.email} onChange={(e) => setDriverData({ ...driverData, email: e.target.value })} />
          <input type="text" placeholder="Perks" value={driverData.perks} onChange={(e) => setDriverData({ ...driverData, perks: e.target.value })} />
          <Select onValueChange={(truckId) => setDriverData({ ...driverData, truck_id: Number(truckId) })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a truck" />
            </SelectTrigger>
            <SelectContent>
              {carrierTrucks
                .filter((truck) => !carriersDrivers.find((driver) => driver.truck_id === truck.id))
                .map((truck) => {
                  console.log("carrierTrucksMap: ", truck);
                  return truck;
                })
                .map((truck) => (
                  <SelectItem key={truck.id} value={String(truck.id)}>
                    {truck.type} (Payload : {truck.payload})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              handleAddTruckNdriver(item.id);
            }}
          >
            Add Driver
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={12}>
          <ExistingTrucks carrierTrucks={carrierTrucks} carriersDrivers={carriersDrivers} onUpdate={() => console.log("Updated carrier details")} />
          <ExistingDrivers carriersDrivers={carriersDrivers} carrierTrucks={carrierTrucks} />
        </TableCell>
      </TableRow>
    </>
  );
}

export default AddTruckNdriver;
