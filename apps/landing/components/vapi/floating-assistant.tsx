"use client";

import { useQuery } from "@tanstack/react-query";
import { Mic, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@novadent/ui";

export const OPEN_ASSISTANT_EVENT = "novadent:open-assistant";

function useAssistantConfig() {
  return useQuery({
    queryKey: ["vapi-config"],
    queryFn: async () => {
      const response = await fetch("/api/vapi");
      if (!response.ok) {
        throw new Error("Unable to load assistant configuration");
      }
      return response.json() as Promise<{ assistantName: string; status: string; ctaLabel: string }>;
    },
  });
}

export function FloatingAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isError, isLoading } = useAssistantConfig();
  const isReady = data?.status === "ready";

  useEffect(() => {
    function handleOpenRequest() {
      setIsOpen(true);
    }

    window.addEventListener(OPEN_ASSISTANT_EVENT, handleOpenRequest);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, handleOpenRequest);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-sm flex-col items-end gap-3">
      {isOpen ? (
        <div className="w-[20rem] rounded-2xl border border-border bg-card p-5 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{data?.assistantName ?? "NovaDent Assistant"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {isLoading ? "Checking connection..." : isReady ? "Ready to talk" : "Temporarily unavailable"}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-secondary px-4 py-3 text-sm leading-6 text-secondary-foreground">
            {isError || !isReady
              ? "The voice assistant is temporarily unavailable. Please use the contact section or call the clinic directly."
              : "Tap start to open a voice conversation. Intake is routed through Vapi and n8n automatically."}
          </div>

          <Button className="mt-4 w-full" disabled={!isReady} size="lg">
            <Mic className="size-4" />
            {data?.ctaLabel ?? "Start voice conversation"}
          </Button>
        </div>
      ) : null}

      <Button
        size="lg"
        onClick={() => setIsOpen((value) => !value)}
        className="rounded-full shadow-lg"
      >
        <Mic className="size-4" />
        Talk to AI Assistant
      </Button>
    </div>
  );
}
