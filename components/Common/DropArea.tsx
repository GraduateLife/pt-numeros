// ... existing code ...

import { Question } from "@/app/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { GameSummeryCard } from "../Summery/GameSummeryCard";

interface DropAreaProps {
  onDrop: (item: Question) => void;
  title: string;
  items: Question[];
  onItemsChange: (items: Question[]) => void;
  initialItems?: Question[];
  bgColor?: string;
  borderColor?: string;
  animate?: boolean;
}

export const DropArea = ({
  onDrop,
  title,
  items,
  onItemsChange: _onItemsChange,
  initialItems = [],
  bgColor = "bg-blue-50",
  borderColor = "border-blue-500",
  animate = false,
}: DropAreaProps) => {
  const onItemsChange = useCallback(
    (newItems: Question[]) => {
      _onItemsChange(newItems);
    },
    [_onItemsChange],
  );

  useEffect(() => {
    if (initialItems.length > 0 && items.length === 0) {
      onItemsChange(initialItems);
    }
  }, [initialItems, items, onItemsChange]);

  return (
    <div className="space-y-2 w-full">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div
        className={cn(
          "boarder border-2 border-dashed rounded-lg p-4 min-h-[100px] flex items-center justify-center transition-colors",
          bgColor,
        )}
        onDragOver={(e) => {
          e.preventDefault();

          e.currentTarget.classList.add(borderColor);
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove(borderColor);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove(borderColor);

          try {
            const data = JSON.parse(e.dataTransfer.getData("text/plain"));
            const itemExists = items.some(
              (item) => item.questionId === data.questionId,
            );
            if (!itemExists) {
              onDrop(data);
              onItemsChange([...items, data]);
            }
          } catch (error) {
            console.error("Failed to parse dropped data:", error);
          }
        }}
      >
        {items.length === 0 && <p className="text-gray-500">拖放题目到这里</p>}
        {items.length > 0 && (
          <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-1">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.questionId}
                  initial={animate ? { opacity: 0, scale: 0.8 } : {}}
                  animate={animate ? { opacity: 1, scale: 1 } : {}}
                  exit={animate ? { opacity: 0, scale: 0.8 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <GameSummeryCard
                    questionId={item.questionId}
                    userInput={item.userInput}
                    question={item.question}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
