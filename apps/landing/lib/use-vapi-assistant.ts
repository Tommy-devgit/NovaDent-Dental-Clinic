"use client";

import Vapi from "@vapi-ai/web";
import { useCallback, useEffect, useRef, useState } from "react";

export type AssistantStatus = "idle" | "connecting" | "connected" | "ended" | "error";

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

export function useVapiAssistant() {
  const vapiRef = useRef<Vapi | null>(null);
  const callStartedAtRef = useRef<number | null>(null);

  const [status, setStatus] = useState<AssistantStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const isConfigured = Boolean(PUBLIC_KEY && ASSISTANT_ID);

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    const vapi = new Vapi(PUBLIC_KEY as string);
    vapiRef.current = vapi;

    function handleCallStart() {
      callStartedAtRef.current = Date.now();
      setStatus("connected");
      setErrorMessage(null);
      setTranscript([]);
    }

    function handleCallEnd() {
      setStatus("ended");
    }

    function handleMessage(message: VapiTranscriptMessage) {
      if (message?.type === "transcript" && message.transcriptType === "final" && message.role && message.transcript) {
        setTranscript((previous) => [...previous, { role: message.role as "user" | "assistant", text: message.transcript as string }]);
      }
    }

    function handleError(error: unknown) {
      setStatus("error");
      setErrorMessage(toErrorMessage(error));
    }

    function handleVolumeLevel(level: number) {
      setVolumeLevel(level);
    }

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);
    vapi.on("volume-level", handleVolumeLevel);

    return () => {
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
      await vapiRef.current.start(ASSISTANT_ID);
    } catch (error) {
      setStatus("error");
      setErrorMessage(toErrorMessage(error));
    }
  }, []);

  const stop = useCallback(() => {
    vapiRef.current?.stop().catch(() => undefined);
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
    isMuted,
    transcript,
    errorMessage,
    volumeLevel,
    elapsedSeconds,
    isConfigured,
    start,
    stop,
    toggleMute,
    reset,
  };
}
