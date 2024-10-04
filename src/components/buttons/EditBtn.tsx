import { Button } from "../ui/button"
import { Edit } from "lucide-react";

type  EditBtnProps = {
  onClick: () => void
}
function EditBtn({ onClick}: EditBtnProps) {
  return (
    <Button onClick={onClick}>
      <Edit size={12}/>
    </Button>
  )
}

export default EditBtn