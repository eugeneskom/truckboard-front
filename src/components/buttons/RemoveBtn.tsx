import { Button } from "../ui/button"
import { Delete } from "lucide-react";

type  RemoveBtnProps = {
  onClick: () => void
}
function RemoveBtn({ onClick}: RemoveBtnProps) {
  return (
    <Button onClick={onClick}>
      <Delete size={12}/>
    </Button>
  )
}

export default RemoveBtn