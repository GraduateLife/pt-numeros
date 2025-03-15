import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WordFormaSearch from "./WordFormaSearch";
import WordGenderSearch from "./WordGenderSearch";

export default function TabSearch() {
  return (
    <div className="">
      <Tabs defaultValue="gender" className="h-full">
        <TabsList className="h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
          <TabsTrigger
            value="gender"
            className="w-1/2 bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
          >
            名词性别查询
          </TabsTrigger>
          <TabsTrigger
            value="forma"
            className="w-1/2 bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
          >
            单词变形查询
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="gender"
          // className="rounded-b-lg border border-t-0 bg-background p-4"
        >
          <WordGenderSearch />
        </TabsContent>
        <TabsContent
          value="forma"
          // className="rounded-b-lg border border-t-0 bg-background p-4"
        >
          <WordFormaSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
}
