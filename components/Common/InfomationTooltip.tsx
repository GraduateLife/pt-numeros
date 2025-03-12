import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import React from "react";

interface InformationTooltipProps {
  text: string;
  className?: string;
  size?: number;
}

const InformationTooltip: React.FC<InformationTooltipProps> = ({
  text,
  className,
  size = 16,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex vertical-middle ml-2 cursor-help">
            <Info
              className={className}
              size={size}
              color="rgba(0, 0, 0, 0.54)"
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InformationTooltip;
