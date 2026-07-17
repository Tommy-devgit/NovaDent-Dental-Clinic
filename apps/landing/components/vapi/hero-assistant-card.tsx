"use client";

import { AlertTriangle, Loader2, Mic, MicOff, PhoneOff, Send, Sparkles } from "lucide-react";
import { useState } from "react";

import { Badge, Button, Input } from "@novadent/ui";

import { openBooking } from "@/lib/booking-events";

import { useVapiAssistantContext } from "./vapi-assistant-provider";

const PHASE_COPY: Record<string, string> = {
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function HeroAssistantCard() {
  const assistant = useVapiAssistantContext();
  const [textValue, setTextValue] = useState("");

  const isSpeaking = assistant.status === "connected" && assistant.phase === "speaking";
  const isListening = assistant.status === "connected" && assistant.phase === "listening";
  const isThinking = assistant.status === "connected" && assistant.phase === "thinking";
  const orbScale = isSpeaking ? 1 + Math.min(assistant.volumeLevel, 1) * 0.12 : 1;

  const lastTwo = assistant.transcript.slice(-2);

  function handleSendText(event: React.FormEvent) {
    event.preventDefault();
    if (!textValue.trim()) return;
    assistant.sendText(textValue);
    setTextValue("");
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl shadow-primary/10 sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/60 via-transparent to-accent-soft/40"
      />

      <div className="relative flex flex-col items-center text-center">
        <Badge variant={assistant.status === "connected" ? "success" : "secondary"} className="mb-6">
          {!assistant.isConfigured
            ? "Assistant unavailable"
            : assistant.status === "connected"
              ? (PHASE_COPY[assistant.phase] ?? "Live")
              : assistant.status === "connecting"
                ? "Connecting…"
                : assistant.status === "error"
                  ? "Connection issue"
                  : "Ready to talk"}
        </Badge>

        <div className="relative flex size-40 items-center justify-center">
          {isListening ? (
            <span className="absolute inset-0 rounded-full animate-orb-pulse" aria-hidden />
          ) : null}

          {isThinking ? (
            <span className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-spin" style={{ animationDuration: "3s" }} aria-hidden />
          ) : null}

          <div
            className="flex size-32 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-transform duration-300"
            style={{ transform: `scale(${orbScale})` }}
          >
            {isSpeaking ? (
              <div className="flex items-end gap-1">
                {[0, 1, 2, 3, 4].map((index) => (
                  <span
                    key={index}
                    className="w-1.5 rounded-full bg-primary-foreground animate-voice-bar"
                    style={{
                      height: "1.75rem",
                      animationDelay: `${index * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            ) : assistant.status === "connecting" ? (
              <Loader2 className="size-10 animate-spin" />
            ) : assistant.status === "error" ? (
              <AlertTriangle className="size-10" />
            ) : (
              <Sparkles className="size-10" />
            )}
          </div>
        </div>

        <h3 className="mt-6 text-xl font-semibold text-foreground">NovaDent AI Assistant</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {!assistant.isConfigured
            ? "Voice isn't configured yet — use the booking form instead."
            : assistant.status === "idle"
              ? "Your 24/7 digital receptionist. Talk or type — right here."
              : assistant.status === "connected"
                ? "Speak naturally, or type below if you'd rather not talk out loud."
                : assistant.status === "ended"
                  ? "Conversation ended. Start a new one anytime."
                  : assistant.errorMessage ?? "Something went wrong."}
        </p>

        {assistant.transcript.length > 0 && assistant.status === "connected" ? (
          <div className="mt-6 w-full max-w-md space-y-2 text-left">
            {lastTwo.map((entry, index) => (
              <div
                key={index}
                className={
                  entry.role === "assistant"
                    ? "max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2 text-sm text-foreground"
                    : "ml-auto max-w-[90%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground"
                }
              >
                {entry.text}
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-8 w-full max-w-md space-y-3">
          {!assistant.isConfigured ? (
            <Button size="lg" className="w-full" onClick={() => openBooking()}>
              Book an appointment
            </Button>
          ) : assistant.status === "idle" || assistant.status === "error" ? (
            <Button size="lg" className="w-full" onClick={assistant.start}>
              <Mic className="size-4" />
              Start conversation
            </Button>
          ) : assistant.status === "connecting" ? (
            <Button size="lg" className="w-full" disabled>
              <Loader2 className="size-4 animate-spin" />
              Connecting…
            </Button>
          ) : assistant.status === "connected" ? (
            <>
              <form onSubmit={handleSendText} className="flex items-center gap-2">
                <Input
                  value={textValue}
                  onChange={(event) => setTextValue(event.target.value)}
                  placeholder="Type instead of talking…"
                  aria-label="Type a message to the assistant"
                />
                <Button type="submit" variant="outline" size="icon" aria-label="Send message" disabled={!textValue.trim()}>
                  <Send className="size-4" />
                </Button>
              </form>
              <div className="flex items-center justify-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">{formatDuration(assistant.elapsedSeconds)}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={assistant.toggleMute}
                  aria-label={assistant.isMuted ? "Unmute microphone" : "Mute microphone"}
                  aria-pressed={assistant.isMuted}
                >
                  {assistant.isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </Button>
                <Button variant="destructive" size="icon" onClick={assistant.stop} aria-label="End call">
                  <PhoneOff className="size-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button size="lg" className="w-full" onClick={assistant.reset}>
              <Mic className="size-4" />
              Start a new conversation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
