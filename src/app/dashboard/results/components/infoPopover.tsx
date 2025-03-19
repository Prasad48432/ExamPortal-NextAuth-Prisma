import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

export function InfoPopover({ text }: { text: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Info className="cursor-pointer" size={15} />
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2 bg-muted">
        <div className="grid gap-4 text-xs font-medium">
            {text}
        </div>
      </PopoverContent>
    </Popover>
  );
}
