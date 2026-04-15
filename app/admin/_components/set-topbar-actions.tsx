"use client";

import { useEffect } from "react";
import { useTopbarActions } from "./topbar-context";

export function SetTopbarActions({ children }: { children: React.ReactNode }) {
  const { setActions } = useTopbarActions();

  useEffect(() => {
    setActions(children);
    return () => setActions(null);
  }, [children, setActions]);

  return null;
}
