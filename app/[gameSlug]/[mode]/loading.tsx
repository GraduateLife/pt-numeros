export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      <p className="text-2xl font-bold">题目加载中</p>
    </div>
  );
}
