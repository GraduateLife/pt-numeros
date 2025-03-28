"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface SelectedTextContextType {
  selectedText: string;
  setSelectedText: (text: string) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const SelectedTextContext = createContext<SelectedTextContextType | undefined>(
  undefined,
);

export const SelectedTextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedText, setSelectedText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleSetSelectedText = (text: string) => {
    setSelectedText(text);
    setIsVisible(true);
  };

  return (
    <SelectedTextContext.Provider
      value={{
        selectedText,
        setSelectedText: handleSetSelectedText,
        isVisible,
        setIsVisible,
      }}
    >
      {children}
    </SelectedTextContext.Provider>
  );
};

export const useSelectedText = () => {
  const context = useContext(SelectedTextContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedText must be used within a SelectedTextProvider",
    );
  }
  return context;
};
