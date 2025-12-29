import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Parameter {
  id: string;
  parameter_name: string;
  min_value: number;
  max_value: number;
  unit: string;
}

interface SpecificationCardProps {
  name: string;
  imageUrl: string | null;
  material?: string;
  parameters: Parameter[];
}

const SpecificationCard = ({ name, imageUrl, material, parameters }: SpecificationCardProps) => {
  return (
    <Card className="overflow-hidden border-border/50">
      <div className="grid md:grid-cols-[1fr_1.5fr] gap-0">
        {/* Left Side: Image and Name */}
        <div className="flex flex-col bg-muted/20 p-6 border-b md:border-b-0 md:border-r border-border/50">
          <div className="flex-1 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="max-w-full max-h-[300px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-[200px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-center mt-4 text-foreground">{name}</h3>
        </div>

        {/* Right Side: Specification Table */}
        <div className="p-6">
          <h4 className="text-lg font-semibold mb-4 text-primary border-b border-primary/20 pb-2">
            Specification
          </h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b border-border/50">
                  <TableHead className="font-bold text-foreground">Parameters</TableHead>
                  <TableHead className="font-bold text-foreground text-center">Min</TableHead>
                  <TableHead className="font-bold text-foreground text-center">Max</TableHead>
                  <TableHead className="font-bold text-foreground text-center">Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parameters.length > 0 ? (
                  <>
                    {parameters.map((param) => (
                      <TableRow key={param.id} className="border-b border-border/30">
                        <TableCell className="font-medium">{param.parameter_name}</TableCell>
                        <TableCell className="text-center">{param.min_value}</TableCell>
                        <TableCell className="text-center">{param.max_value}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{param.unit}</TableCell>
                      </TableRow>
                    ))}
                    {/* Material row */}
                    {material && (
                      <TableRow className="border-b border-border/30 bg-muted/10">
                        <TableCell className="font-medium">Material</TableCell>
                        <TableCell colSpan={3} className="text-center font-medium">
                          {material}
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No specifications defined
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SpecificationCard;
