"use client";

import { Mic, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, Sheet, SheetContent } from "@novadent/ui";

import { OPEN_ASSISTANT_EVENT } from "@/lib/assistant-events";
import { useMediaQuery } from "@/lib/use-media-query";
import { useVapiAssistant } from "@/lib/use-vapi-assistant";

import { AssistantPanel } from "./assistant-panel";

export function FloatingAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const assistant = useVapiAssistant();

  useEffect(() => {
    function handleOpenRequest() {
      setIsOpen(true);
    }

    window.addEventListener(OPEN_ASSISTANT_EVENT, handleOpenRequest);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, handleOpenRequest);
  }, []);

  const panel = (
    <AssistantPanel
      isConfigured={assistant.isConfigured}
      status={assistant.status}
      transcript={assistant.transcript}
      errorMessage={assistant.errorMessage}
      volumeLevel={assistant.volumeLevel}
      elapsedSeconds={assistant.elapsedSeconds}
      isMuted={assistant.isMuted}
      onStart={assistant.start}
      onStop={assistant.stop}
      onToggleMute={assistant.toggleMute}
      onReset={assistant.reset}
    />
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && isDesktop ? (
        <div className="absolute bottom-[calc(100%+1rem)] right-0 h-[32rem] w-[22rem] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close assistant"
            className="absolute right-3 top-3 z-10 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
          {panel}
        </div>
      ) : null}

      {!isDesktop ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="h-[85vh] w-full max-w-none rounded-t-2xl p-0 sm:max-w-none">
            {panel}
          </SheetContent>
        </Sheet>
      ) : null}

      <Button
        size="lg"
        onClick={() => setIsOpen((value) => !value)}
        className="rounded-full shadow-lg"
        aria-expanded={isOpen}
      >
        <Mic className="size-4" />
        Talk to AI Assistant
      </Button>
    </div>
  );
}
