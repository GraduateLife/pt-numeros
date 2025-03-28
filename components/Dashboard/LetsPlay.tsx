import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { GripVertical } from "lucide-react";
import { useState } from "react";
import GameCard from "../GameSection/GameCard";
import { LetsPlayNumberGame } from "../GameSection/number-game";
const SortableItem = ({
  id,
  children,
}: {
  id: UniqueIdentifier;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative flex items-center">
      <div
        {...attributes}
        {...listeners}
        className="absolute cursor-grab active:cursor-grabbing flex items-center justify-center"
      >
        <GripVertical className="w-4 h-4 text-neutral-500 hover:text-neutral-700" />
      </div>
      <div className="flex-1 pl-4">{children}</div>
    </div>
  );
};

export const GameList = () => {
  const [items, setItems] = useState([
    { id: 0, clz: LetsPlayNumberGame },
    { id: 1, clz: LetsPlayNumberGame },
    { id: 2, clz: LetsPlayNumberGame },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    setItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };
  return (
    <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
      <h2 className="text-md my-2">你的自定义小练习</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        modifiers={[
          (args) => ({
            x: 0,
            y: args.transform.y,
            scaleX: 1,
            scaleY: 1,
          }),
        ]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((c) => (
            <div key={c.id}>
              <SortableItem id={c.id}>
                <div className="cursor-default m-1 bg-white dark:bg-neutral-800 shadow-md rounded-lg">
                  <GameCard GameClass={c.clz as any} />
                </div>
              </SortableItem>
            </div>
          ))}
        </SortableContext>
      </DndContext>
      <span className="text-sm self-end mt-2 text-neutral-500 dark:text-neutral-400">
        如何增加你的小练习?
      </span>
    </div>
  );
};
