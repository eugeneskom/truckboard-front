import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";
import ExistingTrucks from "./ExistingTrucks";
import ExistingDrivers from "./ExistingDrivers";
import { CarrierData, DriverData, TruckData } from "@/types";


// {isAddTruck === item.id && (
//   <>
//     <AddDriver 
//     addTruck={handleAddTruck} 
//     addDriverF={handleAddDriver} 
//     item={item} 
//     setTruckData={setTruckData} 
//     truckData={truckData} 
//     setDriverData={setDriverData} 
//     driverData={driverData} 
//     carriersDrivers={carriersDrivers} 
//     carrierTrucks={carrierTrucks}/>
//   </>
// )}

interface AddDriverProps {
  addTruck: (id: number) => void;
  addDriverF: (id: number) => void;
  item: CarrierData;
  truckData: TruckData;
  setTruckData: (data: TruckData) => void;
  driverData: {
    name: string;
    lastname: string;
    phone: string;
    email: string;
    perks: string;
    truck_id: number;
  };
  setDriverData: (data: DriverData) => void;
  carrierTrucks: TruckData[];
  carriersDrivers: DriverData[];
}

function AddDriver({ addTruck, addDriverF, item, setTruckData, truckData, setDriverData, driverData, carriersDrivers, carrierTrucks }: AddDriverProps) {
  return (
    <>
      <TableRow>
        <TableCell colSpan={6}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (item.id !== undefined) {
                addTruck(item.id);
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
                addDriverF(item.id);
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

export default AddDriver;
