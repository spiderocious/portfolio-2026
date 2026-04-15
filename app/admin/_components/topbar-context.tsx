"use client";

import { createContext, useContext, useState, useCallback } from "react";

type TopbarActionsContextValue = {
  actions: React.ReactNode;
  setActions: (node: React.ReactNode) => void;
};

const TopbarActionsContext = createContext<TopbarActionsContextValue>({
  actions: null,
  setActions: () => {},
});

export function TopbarActionsProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActionsState] = useState<React.ReactNode>(null);
  const setActions = useCallback((node: React.ReactNode) => {
    setActionsState(node);
  }, []);

  return (
    <TopbarActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </TopbarActionsContext.Provider>
  );
}

export function useTopbarActions() {
  return useContext(TopbarActionsContext);
}
