import { Badge } from "../../../components/ui/badge";

function PriorityBadge({ priority }) {
  const p = priority || "Medium";
  
  let colorClass = "bg-amber-100 text-amber-800 hover:bg-amber-100";
  if (p === "High") colorClass = "bg-red-100 text-red-800 hover:bg-red-100";
  if (p === "Low") colorClass = "bg-green-100 text-green-800 hover:bg-green-100";

  return (
    <Badge variant="outline" className={`font-medium border-0 ${colorClass}`}>
      {p}
    </Badge>
  );
}

export default PriorityBadge;
