import { Button } from "../ui/button"
import { Undo } from "lucide-react";


type  UndoBtnProps = {
  onClick: () => void
}
function UndoBtn({ onClick}: UndoBtnProps) {
  return (
    <Button onClick={onClick}>
      <Undo size={12}/>
    </Button>
  )
}

export default UndoBtn