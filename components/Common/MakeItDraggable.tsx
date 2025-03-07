import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DraggableWrapperProps {
  children: ReactNode;
  className?: string;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent) => void;
}

export function MakeItDraggable({
  children,
  className,
  onDragEnd,
}: DraggableWrapperProps) {
  return (
    <motion.div
      drag
      dragMomentum={false} // Disable momentum for precise positioning
      className={`cursor-grab ${className || ""}`}
      whileDrag={{
        scale: 1.05,
      }} // Optional: slight scale effect while dragging
      onDragEnd={onDragEnd}
    >
      {children}
    </motion.div>
  );
}
