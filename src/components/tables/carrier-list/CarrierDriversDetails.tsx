import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { DriverData, TruckData } from "@/types";

interface CarrierDriversDetailsProps {
  // carrierId: string | undefined;
  carriersDrivers: DriverData[];
  carrierTrucks: TruckData[];
  // onUpdate: () => void;
}

const CarrierDriversDetails: React.FC<CarrierDriversDetailsProps> = ({ 
  // carrierId,
   carriersDrivers, 
   carrierTrucks
  //  onUpdate
   }) => {
  // const [assigningDriver, setAssigningDriver] = useState<string | null>(null);

  console.log("carriersDrivers", carriersDrivers
    // ,carrierTrucks
  );
  const handleAssignDriver = async (driverId: string, truckId: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}api/drivers/${driverId}`, { truck_id: truckId });
      // setAssigningDriver(null);
      // onUpdate(); // Refresh data after assignment
    } catch (error) {
      console.error("Error assigning driver:", error);
    }
  };

  return (
    <Table className="border-solid border-black">
      <TableCaption>Driver Details</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Driver ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Perks</TableHead>
          <TableHead>Assigned to truck №</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carriersDrivers.map((driver) => {
          const assignedTruck = carrierTrucks.find((truck) => truck.id  === driver.truck_id);
          console.log('assignedDriver',assignedTruck)
          return (
            <TableRow key={driver.id}>
              <TableCell>{driver.id}</TableCell>
              <TableCell>{driver.name}</TableCell>
              <TableCell>{driver.lastname}</TableCell>
              <TableCell>{driver.phone}</TableCell>
              <TableCell>{driver.email}</TableCell>
              <TableCell>{driver.perks}</TableCell>
              <TableCell>
                {assignedTruck ? (
                  <>
                    {assignedTruck.id}
                  </>
                ) : (
                  <>
                  <p>Not assigned</p>
                  {/* <Button onClick={() => setAssigningDriver(driver.id.toString())}>Assign Driver</Button>
                {assigningDriver === driver.id.toString() && (
                  <Select onValueChange={(driverId) => handleAssignDriver(driverId, driver.id.toString())}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {carriersDrivers
                        .filter((driver) => !driver.truck_id)
                        .map((driver) => (
                          <SelectItem key={driver.id} value={String(driver.id)}>
                            {driver.name} {driver.lastname}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )} */}
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
                    {carriersDrivers
                      // .filter((driver) => !carriersDrivers.some((d) => d.truck_id === driver.id))
                      .map((driver) => (
                        <SelectItem key={driver.id} value={driver.id.toString()}>
                          {driver.name} - {driver.lastname}
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

export default CarrierDriversDetails;
