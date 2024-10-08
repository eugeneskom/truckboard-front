import { Button } from "../ui/button"
import { Truck } from "lucide-react";

type  AddTruckProps = {
  onClick: () => void
}
function AddTruck({ onClick}: AddTruckProps) {
  return (
    <Button onClick={onClick}>
      <Truck size={12}/>
    </Button>
  )
}

export default AddTruck