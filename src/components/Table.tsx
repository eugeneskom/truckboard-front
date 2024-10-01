// Import necessary React and Next.js types
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CarrierData } from "@/types";

// Define the props interface that will be passed to your page component
interface TableProps {
  data: CarrierData[]; // This is the data type you expect from the backend
}

// Define the TableCarriers component to render the table
function TableCarriers({ data }: TableProps) {

  return (
    <Table>
      <TableCaption>A list of carriers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Carrier Number</TableHead>
          <TableHead>Agent Number</TableHead>
          <TableHead>Home City</TableHead>
          <TableHead>Carrier Email</TableHead>
          <TableHead>MC Number</TableHead>
          <TableHead>Company Name</TableHead>
          <TableHead>Company Phone</TableHead>
          <TableHead>Truck Type Spam</TableHead>
          <TableHead>Spam</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Iterate over the data array and render each row */}
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.carrier_number}</TableCell>
            <TableCell>{item.agent_number}</TableCell>
            <TableCell>{item.home_city}</TableCell>
            <TableCell>{item.carrier_email}</TableCell>
            <TableCell>{item.mc_number}</TableCell>
            <TableCell>{item.company_name}</TableCell>
            <TableCell>{item.company_phone}</TableCell>
            <TableCell>{item.truck_type_spam}</TableCell>
            <TableCell>{item.spam}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TableCarriers;
