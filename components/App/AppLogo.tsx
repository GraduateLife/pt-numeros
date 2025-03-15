import { motion } from "framer-motion";
import Link from "next/link";

export const AppLogo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-violet-500 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-violet-500 dark:text-white whitespace-pre"
      >
        <span className="text-violet-500 dark:text-white">P</span>
        <span>alavra</span>
      </motion.span>
    </Link>
  );
};
