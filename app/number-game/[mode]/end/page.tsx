"use client";
import { GameHistory, historyStorage } from "@/app/storage/history";
import { restLifeStorage } from "@/app/storage/restLife";
import { Question, QuestionType } from "@/app/types";
import { DropArea } from "@/components/Common/DropArea";
import { AccuracyIndicator } from "@/components/NumberGame/AccuracyIndicator";
import { GameSummeryCard } from "@/components/Summery/GameSummeryCard";
import { QuickSortDialog } from "@/components/Summery/QuickSortDialog";
import { Button } from "@/components/ui/button";
import { isAnswerCorrect } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const historiesToQuestion = (history: GameHistory[]): Question[] => {
  return history.map((entry) => ({
    questionId: history.findIndex((h) => h.timestamp === entry.timestamp),
    userInput: String(entry.input),
    questionText: String(entry.answer),
    referenceAnswer: String(entry.answer),
    questionType: QuestionType.FillFree,
  }));
};
const sortByQuestionId = (items: Question[]) => {
  return [...items].sort((a, b) => a.questionId - b.questionId);
};

enum LearningZone {
  Practice = "practice",
  Familiar = "familiar",
  Mastered = "mastered",
}

const determineInitialZone = (item: Question): LearningZone => {
  if (!isAnswerCorrect(item)) {
    return LearningZone.Practice;
  }
  return LearningZone.Mastered;
};

export default function GameEndPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [needPracticeZoneItems, setNeedPracticeZoneItems] = useState<
    Question[]
  >([]);
  const [familiarZoneItems, setFamiliarZoneItems] = useState<Question[]>([]);
  const [masteredZoneItems, setMasteredZoneItems] = useState<Question[]>([]);

  // 初始化获取本轮做题历史
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = historyStorage.getHistory();
      const allQuestions = historiesToQuestion(savedHistory);

      // Use the new function to sort items into their initial zones
      const sortedItems = allQuestions.reduce(
        (acc, item) => {
          const zone = determineInitialZone(item);
          acc[zone].push(item);
          return acc;
        },
        { practice: [], familiar: [], mastered: [] } as Record<
          LearningZone,
          Question[]
        >,
      );

      setNeedPracticeZoneItems(sortedItems.practice);
      setFamiliarZoneItems(sortedItems.familiar);
      setMasteredZoneItems(sortedItems.mastered);
    }
  }, []);

  const handleDrop = (item: Question, targetArea: LearningZone) => {
    // Remove the item from all areas first
    const removeFromAll = () => {
      setNeedPracticeZoneItems((items) =>
        items.filter((i) => i.questionId !== item.questionId),
      );
      setFamiliarZoneItems((items) =>
        items.filter((i) => i.questionId !== item.questionId),
      );
      setMasteredZoneItems((items) =>
        items.filter((i) => i.questionId !== item.questionId),
      );
    };

    // Then add to the target area with animation
    removeFromAll();
    switch (targetArea) {
      case LearningZone.Practice:
        setNeedPracticeZoneItems((items) => [
          ...items,
          { ...item, key: Date.now() },
        ]);
        break;
      case LearningZone.Familiar:
        setFamiliarZoneItems((items) => [
          ...items,
          { ...item, key: Date.now() },
        ]);
        break;
      case LearningZone.Mastered:
        setMasteredZoneItems((items) => [
          ...items,
          { ...item, key: Date.now() },
        ]);
        break;
    }
  };

  const handleQuickSort = (type: "all-practice" | "correct-familiar") => {
    const allQuestions = [
      ...needPracticeZoneItems,
      ...familiarZoneItems,
      ...masteredZoneItems,
    ];

    const sortedItems = allQuestions.reduce(
      (acc, item) => {
        if (type === "all-practice") {
          acc.practice.push(item);
        } else {
          const zone = determineInitialZone(item);
          acc[zone].push(item);
        }
        return acc;
      },
      { practice: [], familiar: [], mastered: [] } as Record<
        LearningZone,
        Question[]
      >,
    );

    setNeedPracticeZoneItems(sortedItems.practice);
    setFamiliarZoneItems(sortedItems.familiar);
    setMasteredZoneItems(sortedItems.mastered);
    setIsDialogOpen(false);
  };

  const handleSortByQuestionId = () => {
    setNeedPracticeZoneItems(sortByQuestionId([...needPracticeZoneItems]));
    setFamiliarZoneItems(sortByQuestionId([...familiarZoneItems]));
    setMasteredZoneItems(sortByQuestionId([...masteredZoneItems]));
    toast.success("已按题号排序");
  };

  return (
    <div className="min-h-[90vh] p-6 w-full flex flex-col items-center justify-center py-8 select-none">
      <AccuracyIndicator />
      <div className="mt-4 flex flex-col items-center gap-4 w-full max-w-7xl">
        <div className="self-start flex justify-between w-full items-center">
          <span className="text-sm text-gray-500">
            在下一次练习中,这些题目将...
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={handleSortByQuestionId}
            >
              按题号排序
            </Button>
            <QuickSortDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onSort={handleQuickSort}
            />
          </div>
        </div>
        <div className="w-full xl:grid xl:grid-cols-2 xl:gap-4 space-y-4 xl:space-y-0">
          <div className="space-y-4">
            <DropArea
              onDrop={(item) => handleDrop(item, LearningZone.Practice)}
              title={`增加出现频率(${needPracticeZoneItems.length})`}
              bgColor="bg-red-50"
              borderColor="border-red-500"
              items={needPracticeZoneItems}
              onItemsChange={setNeedPracticeZoneItems}
              renderItem={(item) => (
                <GameSummeryCard
                  questionId={item.questionId}
                  userInput={item.userInput}
                  question={item.referenceAnswer}
                />
              )}
            />
          </div>
          <div className="space-y-4">
            <DropArea
              onDrop={(item) => handleDrop(item, LearningZone.Familiar)}
              title={`不会改变出现频率(${familiarZoneItems.length})`}
              bgColor="bg-yellow-50"
              borderColor="border-yellow-500"
              items={familiarZoneItems}
              onItemsChange={setFamiliarZoneItems}
              renderItem={(item) => (
                <GameSummeryCard
                  questionId={item.questionId}
                  userInput={item.userInput}
                  question={item.referenceAnswer}
                />
              )}
            />
            <DropArea
              onDrop={(item) => handleDrop(item, LearningZone.Mastered)}
              title={`减少出现频率(${masteredZoneItems.length})`}
              bgColor="bg-green-50"
              borderColor="border-green-500"
              items={masteredZoneItems}
              onItemsChange={setMasteredZoneItems}
              renderItem={(item) => (
                <GameSummeryCard
                  questionId={item.questionId}
                  userInput={item.userInput}
                  question={item.referenceAnswer}
                />
              )}
            />
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-4 w-full max-w-2xl"
          onClick={() => {
            historyStorage.clearHistory();
            restLifeStorage.clearLives();
            router.push(`/`);
          }}
        >
          再来一轮
        </Button>
      </div>
    </div>
  );
}
