import { Input } from "../ui/input";

const TruckDimsInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  const [length, width, height] = value.split("x").map((v) => v.trim());

  const handleChange = (index: number, newValue: string) => {
    const values = value.split("x").map((v) => v.trim());
    values[index] = newValue;
    onChange(values.join("x"));
  };

  return (
    <div className="flex space-x-1">
      {["Length", "Width", "Height"].map((label, index) => (
        <Input
          key={label}
          className={`
          min-w-[70px] 
          ${className}
          [appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
          `}
          type="number"
          value={[length, width, height][index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          placeholder={label}
          min={0}
        />
      ))}
    </div>
  );
};

export default TruckDimsInput;
