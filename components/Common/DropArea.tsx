// ... existing code ...

import { cn, PrimitiveType } from "@/lib/utils";
import { useCallback, useEffect } from "react";
import { DragWrapper } from "./Draggable";

interface DropAreaProps {
  onDrop: (item: Record<string, PrimitiveType>) => void;
  title: string;
  items: Record<string, PrimitiveType>[];
  onItemsChange: (items: Record<string, PrimitiveType>[]) => void;
  initialItems?: Record<string, PrimitiveType>[];
  bgColor?: string;
  borderColor?: string;
  renderItem: (item: Record<string, PrimitiveType>) => React.ReactNode;
  renderKey: string;
}

export const DropArea = ({
  onDrop,
  title,
  items,
  onItemsChange: _onItemsChange,
  initialItems = [],
  bgColor = "bg-blue-50",
  borderColor = "border-blue-500",
  renderItem,
  renderKey,
}: DropAreaProps) => {
  const onItemsChange = useCallback(
    (newItems: Record<string, PrimitiveType>[]) => {
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
          <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-1">
            {items.map((item) => (
              <DragWrapper
                hoverClassName="ring-2 border-dashed rounded-md ring-green-200"
                key={item[renderKey].toString()}
                onDrop={(e) => {
                  try {
                    const draggedItem = JSON.parse(
                      e.dataTransfer.getData("text/plain"),
                    );
                    const targetItem = item;

                    // Check if the dragged item is already in the list
                    const draggedIndex = items.findIndex(
                      (i) => i[renderKey] === draggedItem[renderKey],
                    );
                    const targetIndex = items.findIndex(
                      (i) => i[renderKey] === targetItem[renderKey],
                    );
                    if (draggedIndex === -1) {
                      // This is a new item being dropped
                      const newItems = [...items];
                      // Insert the new item at the target position
                      newItems.splice(targetIndex, 0, draggedItem);
                      onItemsChange(newItems);
                      onDrop(draggedItem);
                    } else {
                      // This is reordering existing items
                      const newItems = [...items];
                      // Remove the dragged item from its original position
                      newItems.splice(draggedIndex, 1);
                      // Insert it at the new position
                      newItems.splice(targetIndex, 0, draggedItem);
                      onItemsChange(newItems);
                    }
                  } catch (error) {
                    console.error("Failed to handle card drop:", error);
                  }
                }}
              >
                {/* <GameSummeryCard
                  questionId={item.questionId}
                  userInput={item.userInput}
                  question={item.question}
                /> */}
                {renderItem(item)}
              </DragWrapper>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
