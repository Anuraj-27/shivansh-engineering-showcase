import { Input } from "@/components/ui/input";
import { FIXED_PARAMETERS, FixedSpecificationData } from "@/lib/fixedParameters";

interface FixedParameterEditorProps {
  data: FixedSpecificationData;
  onChange: (field: keyof FixedSpecificationData, value: number | string) => void;
  disabled?: boolean;
}

const FixedParameterEditor = ({ data, onChange, disabled }: FixedParameterEditorProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Parameters</th>
            <th className="px-4 py-2 text-center font-semibold">Min</th>
            <th className="px-4 py-2 text-center font-semibold">Max</th>
            <th className="px-4 py-2 text-center font-semibold">Unit</th>
          </tr>
        </thead>
        <tbody>
          {FIXED_PARAMETERS.map((param) => (
            <tr key={param.key} className="border-t">
              <td className="px-4 py-2 font-medium text-muted-foreground">{param.name}</td>
              <td className="px-4 py-2">
                <Input
                  type="number"
                  value={data[`${param.key}_min` as keyof FixedSpecificationData] as number}
                  onChange={(e) => 
                    onChange(`${param.key}_min` as keyof FixedSpecificationData, parseFloat(e.target.value) || 0)
                  }
                  className="w-20 mx-auto text-center"
                  disabled={disabled}
                />
              </td>
              <td className="px-4 py-2">
                <Input
                  type="number"
                  value={data[`${param.key}_max` as keyof FixedSpecificationData] as number}
                  onChange={(e) => 
                    onChange(`${param.key}_max` as keyof FixedSpecificationData, parseFloat(e.target.value) || 0)
                  }
                  className="w-20 mx-auto text-center"
                  disabled={disabled}
                />
              </td>
              <td className="px-4 py-2 text-center text-muted-foreground">{param.unit}</td>
            </tr>
          ))}
          {/* Material row */}
          <tr className="border-t bg-muted/10">
            <td className="px-4 py-2 font-medium text-muted-foreground">Material</td>
            <td colSpan={3} className="px-4 py-2">
              <Input
                value={data.material}
                onChange={(e) => onChange("material", e.target.value)}
                className="w-full max-w-xs mx-auto text-center"
                placeholder="HR / CR / MS / Stainless Steel"
                disabled={disabled}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FixedParameterEditor;
