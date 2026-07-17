"use client";

import Vapi from "@vapi-ai/web";
import { useCallback, useEffect, useRef, useState } from "react";

export type AssistantStatus = "idle" | "connecting" | "connected" | "ended" | "error";

export type ConversationPhase = "listening" | "thinking" | "speaking";

export interface TranscriptEntry {
  role: "user" | "assistant";
  text: string;
}

interface VapiTranscriptMessage {
  type?: string;
  role?: "user" | "assistant";
  transcript?: string;
  transcriptType?: "partial" | "final";
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong with the voice connection.";
}

function persistConversation(payload: {
  externalConversationId: string;
  transcript: TranscriptEntry[];
  startedAt: number | null;
  endedAt: number;
}) {
  if (payload.transcript.length === 0) {
    return;
  }

  fetch("/api/conversations/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      externalConversationId: payload.externalConversationId,
      transcript: payload.transcript,
      startedAt: payload.startedAt ? new Date(payload.startedAt).toISOString() : undefined,
      endedAt: new Date(payload.endedAt).toISOString(),
    }),
    keepalive: true,
  }).catch(() => undefined);
}

export function useVapiAssistant() {
  const vapiRef = useRef<Vapi | null>(null);
  const callStartedAtRef = useRef<number | null>(null);
  const callIdRef = useRef<string | null>(null);
  const transcriptRef = useRef<TranscriptEntry[]>([]);

  const [status, setStatus] = useState<AssistantStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [phase, setPhase] = useState<ConversationPhase>("listening");
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isConfigured = Boolean(PUBLIC_KEY && ASSISTANT_ID);

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    const vapi = new Vapi(PUBLIC_KEY as string);
    vapiRef.current = vapi;

    function clearThinkingTimeout() {
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
        thinkingTimeoutRef.current = null;
      }
    }

    function handleCallStart() {
      callStartedAtRef.current = Date.now();
      transcriptRef.current = [];
      setStatus("connected");
      setPhase("listening");
      setErrorMessage(null);
      setTranscript([]);
    }

    function handleCallEnd() {
      clearThinkingTimeout();
      setStatus("ended");

      if (callIdRef.current) {
        persistConversation({
          externalConversationId: callIdRef.current,
          transcript: transcriptRef.current,
          startedAt: callStartedAtRef.current,
          endedAt: Date.now(),
        });
      }
    }

    function handleMessage(message: VapiTranscriptMessage) {
      if (message?.type === "transcript" && message.transcriptType === "final" && message.role && message.transcript) {
        const entry = { role: message.role as "user" | "assistant", text: message.transcript as string };
        transcriptRef.current = [...transcriptRef.current, entry];
        setTranscript((previous) => [...previous, entry]);

        if (message.role === "user") {
          setPhase("thinking");
          clearThinkingTimeout();
          thinkingTimeoutRef.current = setTimeout(() => setPhase("listening"), 6000);
        }
      }
    }

    function handleSpeechStart() {
      clearThinkingTimeout();
      setPhase("speaking");
    }

    function handleSpeechEnd() {
      setPhase("listening");
    }

    function handleError(error: unknown) {
      clearThinkingTimeout();
      setStatus("error");
      setErrorMessage(toErrorMessage(error));
    }

    function handleVolumeLevel(level: number) {
      setVolumeLevel(level);
    }

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("error", handleError);
    vapi.on("volume-level", handleVolumeLevel);

    return () => {
      clearThinkingTimeout();
      vapi.removeAllListeners();
      vapi.stop().catch(() => undefined);
      vapiRef.current = null;
    };
  }, [isConfigured]);

  useEffect(() => {
    if (status !== "connected") {
      return;
    }

    const interval = setInterval(() => {
      if (callStartedAtRef.current) {
        setElapsedSeconds(Math.floor((Date.now() - callStartedAtRef.current) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const start = useCallback(async () => {
    if (!vapiRef.current || !ASSISTANT_ID) {
      return;
    }

    setStatus("connecting");
    setErrorMessage(null);
    setElapsedSeconds(0);

    try {
      const call = await vapiRef.current.start(ASSISTANT_ID);
      callIdRef.current = call?.id ?? null;
    } catch (error) {
      setStatus("error");
      setErrorMessage(toErrorMessage(error));
    }
  }, []);

  const stop = useCallback(() => {
    vapiRef.current?.stop().catch(() => undefined);
  }, []);

  const sendText = useCallback((text: string) => {
    const trimmed = text.trim();

    if (!trimmed || !vapiRef.current) {
      return;
    }

    const entry: TranscriptEntry = { role: "user", text: trimmed };
    transcriptRef.current = [...transcriptRef.current, entry];
    setTranscript((previous) => [...previous, entry]);
    setPhase("thinking");
    vapiRef.current.send({
      type: "add-message",
      message: { role: "user", content: trimmed },
      triggerResponseEnabled: true,
    });
  }, []);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) {
      return;
    }

    const next = !vapiRef.current.isMuted();
    vapiRef.current.setMuted(next);
    setIsMuted(next);
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setTranscript([]);
    setErrorMessage(null);
    setElapsedSeconds(0);
  }, []);

  return {
    status,
    phase,
    isMuted,
    transcript,
    errorMessage,
    volumeLevel,
    elapsedSeconds,
    isConfigured,
    start,
    stop,
    toggleMute,
    sendText,
    reset,
  };
}
