import { Button } from "../ui/button"
import { Save } from "lucide-react";


type  SaveBtnProps = {
  onClick: () => void
}
function SaveBtn({ onClick}: SaveBtnProps) {
  return (
    <Button onClick={onClick}>
      <Save size={12}/>
    </Button>
  )
}

export default SaveBtn