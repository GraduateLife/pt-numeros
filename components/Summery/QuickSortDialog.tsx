import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type QuickSortType = "all-practice" | "correct-familiar";

interface QuickSortDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSort: (type: QuickSortType) => void;
}

export function QuickSortDialog({
  open,
  onOpenChange,
  onSort,
}: QuickSortDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-sm">
          快速分区
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>下一轮练习中</DialogTitle>
          <DialogDescription className="pt-4">
            你将如何面对这些题目？
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={() => onSort("correct-familiar")}>
            错题进入红区, 对题进入绿区
            <span className="text-xs text-gray-500 ml-2">(默认)</span>
          </Button>
          <Button variant="outline" onClick={() => onSort("all-practice")}>
            全部移至红区
          </Button>
        </div>
        <div className="mt-4 text-sm text-gray-500 space-y-2">
          <p>
            <span className="text-red-500 font-medium">红区</span>
            ：题目的出现频率会在下一轮练习中
            <span className="text-red-500">增加</span>
          </p>
          <p>
            <span className="text-yellow-500 font-medium">黄区</span>
            ：题目的出现频率会在下一轮练习中
            <span className="text-yellow-500">不变</span>
          </p>
          <p>
            <span className="text-green-500 font-medium">绿区</span>
            ：题目的出现频率会在下一轮练习中
            <span className="text-green-500">降低</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
