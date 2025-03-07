"use client";

import { useEffect, useState } from "react";

interface SkipSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SkipSSR({ children, fallback = null }: SkipSSRProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return fallback;
  }

  return children;
}
