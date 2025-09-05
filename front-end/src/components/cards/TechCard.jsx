import { Card, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { TECHNOLOGIES } from "../../constants/technologies";
import { cn } from "../../lib/utils";


export default function TechCard({ tech, className}) {
  const matchedTech = TECHNOLOGIES.find(t => t.technology_name === tech.technology_name);

  return (  
    <Card className={cn(
      "dark:bg-[#0f1117] border border-gray-800 hover:border-[#ef8733] transition-all aspect-square justify-center",
      className
    )}>
      <CardHeader>
        <i className={cn(matchedTech?.logo, "text-3xl mb-2")} alt={tech.technology_name}></i>
        <CardTitle className="text-xl">{tech.technology_name}</CardTitle>
      </CardHeader>
    </Card>
  );
}
