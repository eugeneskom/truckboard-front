import React
// ,
//  { useState }
 from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { DriverData, TruckData } from "@/types";

interface ExistingTrucksProps {
  carrierTrucks: TruckData[];
  carriersDrivers: DriverData[];
  onUpdate: () => void;
}

const ExistingTrucks: React.FC<ExistingTrucksProps> = ({
  carrierTrucks,
  carriersDrivers,
  onUpdate,
}) => {
  // const [assigningDriver, setAssigningDriver] = useState<string | null>(null);

  console.log("carriersDrivers", carrierTrucks);
  const handleAssignDriver = async (driverId: string, truckId: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/drivers/${driverId}`, { truck_id: truckId });
      // setAssigningDriver(null);
      onUpdate(); // Refresh data after assignment
    } catch (error) {
      console.error("Error assigning driver:", error);
    }
  };

  return (
    <Table>
      <TableCaption>Trucks Details</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Truck ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Dims</TableHead>
          <TableHead>Payload</TableHead>
          <TableHead>Accessories</TableHead>
          <TableHead>Assigned Driver</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carrierTrucks.map((truck) => {
          const assignedDriver = carriersDrivers.find((driver) => driver.truck_id === truck.id);
          console.log("assignedDriver", assignedDriver);
          return (
            <TableRow key={truck.id}>
              <TableCell>{truck.id}</TableCell>
              <TableCell>{truck.type}</TableCell>
              <TableCell>{truck.dims}</TableCell>
              <TableCell>{truck.payload}</TableCell>
              <TableCell>{truck.accessories}</TableCell>
              <TableCell className="flex justify-between gap-4">
                {assignedDriver ? (
                  <>
                    {assignedDriver.name} {assignedDriver.lastname}
                  </>
                ) : (
                  <>
                  <p>Not assigned</p>
                    {/* {assigningDriver === truck.id.toString() && (
                      <Select onValueChange={(driverId) => handleAssignDriver(driverId, truck.id.toString())}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {carriersDrivers
                            .filter((driver) => !driver.truck_id)
                            .map((driver) => {
                              console.log("driver:", driver);
                              return driver;
                            })
                            .map((driver) => (
                              <SelectItem key={driver.id} value={String(driver.id)}>
                                {driver.name} {driver.lastname}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Button onClick={() => setAssigningDriver(truck.id.toString())}>Assign Driver</Button> */}
                  </>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={12}>Unassigned Drivers</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carriersDrivers
          .filter((driver) => !driver.truck_id)
          .map((driver) => (
            <TableRow key={driver.id}>
              <TableCell colSpan={12}>
                {driver.name} ({driver.lastname})
              </TableCell>
              <TableCell>
                <Select onValueChange={(truckId) => handleAssignDriver(driver.id.toString(), truckId)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to truck" />
                  </SelectTrigger>
                  <SelectContent>
                    {carrierTrucks
                      .filter((truck) => !carriersDrivers.some((d) => d.truck_id === truck.id))
                      .map((truck) => (
                        <SelectItem key={truck.id} value={truck.id.toString()}>
                          {truck.type} - {truck.dims}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default ExistingTrucks;
