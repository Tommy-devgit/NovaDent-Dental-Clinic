"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useVapiAssistant } from "@/lib/use-vapi-assistant";

type VapiAssistantContextValue = ReturnType<typeof useVapiAssistant>;

const VapiAssistantContext = createContext<VapiAssistantContextValue | null>(null);

export function VapiAssistantProvider({ children }: { children: ReactNode }) {
  const assistant = useVapiAssistant();
  return <VapiAssistantContext.Provider value={assistant}>{children}</VapiAssistantContext.Provider>;
}

export function useVapiAssistantContext() {
  const context = useContext(VapiAssistantContext);

  if (!context) {
    throw new Error("useVapiAssistantContext must be used within a VapiAssistantProvider");
  }

  return context;
}
