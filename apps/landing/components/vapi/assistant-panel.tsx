"use client";

import { AlertTriangle, Loader2, Mic, MicOff, PhoneOff, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

import { Badge, Button } from "@novadent/ui";

import type { AssistantStatus, TranscriptEntry } from "@/lib/use-vapi-assistant";

const STATUS_COPY: Record<AssistantStatus, { label: string; variant: "muted" | "warning" | "success" | "destructive" }> = {
  idle: { label: "Ready to talk", variant: "muted" },
  connecting: { label: "Connecting…", variant: "warning" },
  connected: { label: "Live", variant: "success" },
  ended: { label: "Ended", variant: "muted" },
  error: { label: "Connection issue", variant: "destructive" },
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export interface AssistantPanelProps {
  isConfigured: boolean;
  status: AssistantStatus;
  transcript: TranscriptEntry[];
  errorMessage: string | null;
  volumeLevel: number;
  elapsedSeconds: number;
  isMuted: boolean;
  onStart: () => void;
  onStop: () => void;
  onToggleMute: () => void;
  onReset: () => void;
}

export function AssistantPanel({
  isConfigured,
  status,
  transcript,
  errorMessage,
  volumeLevel,
  elapsedSeconds,
  isMuted,
  onStart,
  onStop,
  onToggleMute,
  onReset,
}: AssistantPanelProps) {
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const statusCopy = STATUS_COPY[status];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">NovaDent AI Assistant</p>
            <p className="text-xs text-muted-foreground">Your clinic&apos;s AI receptionist</p>
          </div>
        </div>
        <Badge variant={statusCopy.variant}>{statusCopy.label}</Badge>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {!isConfigured ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <AlertTriangle className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Voice assistant unavailable</p>
            <p className="text-xs text-muted-foreground">
              Please use the contact section or call the clinic directly.
            </p>
          </div>
        ) : status === "idle" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm leading-6 text-muted-foreground">
              Tap start to talk with our AI assistant. It can answer questions, check symptoms, and request an
              appointment on your behalf — right here on the page.
            </p>
          </div>
        ) : status === "connecting" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Connecting to the assistant…</p>
          </div>
        ) : status === "error" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="size-6 text-destructive" />
            <p className="text-sm font-medium text-foreground">Couldn&apos;t connect</p>
            <p className="text-xs text-muted-foreground">{errorMessage ?? "Please try again in a moment."}</p>
          </div>
        ) : (
          <>
            {transcript.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                {status === "connected" ? "Listening… start talking whenever you're ready." : "Conversation ended."}
              </p>
            ) : (
              transcript.map((entry, index) => (
                <div
                  key={index}
                  className={
                    entry.role === "assistant"
                      ? "max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm leading-6 text-foreground"
                      : "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm leading-6 text-primary-foreground"
                  }
                >
                  {entry.text}
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </>
        )}
      </div>

      {isConfigured ? (
        <div className="border-t border-border p-4">
          {status === "idle" || status === "error" ? (
            <Button size="lg" className="w-full" onClick={onStart}>
              <Mic className="size-4" />
              Start conversation
            </Button>
          ) : status === "connecting" ? (
            <Button size="lg" className="w-full" disabled>
              <Loader2 className="size-4 animate-spin" />
              Connecting…
            </Button>
          ) : status === "connected" ? (
            <div className="flex items-center gap-2">
              <span className="flex-1 text-center text-xs font-medium text-muted-foreground">
                {formatDuration(elapsedSeconds)}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleMute}
                aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                aria-pressed={isMuted}
                style={{ boxShadow: !isMuted && volumeLevel > 0.1 ? "0 0 0 3px var(--color-accent-soft)" : undefined }}
              >
                {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </Button>
              <Button variant="destructive" size="icon" onClick={onStop} aria-label="End call">
                <PhoneOff className="size-4" />
              </Button>
            </div>
          ) : (
            <Button size="lg" className="w-full" onClick={onReset}>
              <Mic className="size-4" />
              Start a new conversation
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
