"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
const DEBOUNCE_MS = 8000;

function persistChat(sessionId: string, messages: ChatMessage[], status: "IN_PROGRESS" | "COMPLETED", keepalive = false) {
  if (messages.length === 0) return;

  fetch("/api/conversations/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      externalConversationId: sessionId,
      channel: "chat",
      status,
      transcript: messages,
      endedAt: new Date().toISOString(),
    }),
    keepalive,
  }).catch(() => undefined);
}

export function useNovadentChat() {
  const isConfigured = Boolean(PUBLIC_KEY && ASSISTANT_ID);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const chatIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const messagesRef = useRef<ChatMessage[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      persistChat(sessionIdRef.current, messagesRef.current, "IN_PROGRESS");
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [messages]);

  useEffect(() => {
    function handleUnload() {
      persistChat(sessionIdRef.current, messagesRef.current, "COMPLETED", true);
    }

    window.addEventListener("pagehide", handleUnload);
    return () => {
      window.removeEventListener("pagehide", handleUnload);
      handleUnload();
    };
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !isConfigured) return;

    setErrorMessage(null);
    setMessages((previous) => [...previous, { role: "user", content: trimmed }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, previousChatId: chatIdRef.current ?? undefined }),
      });

      const data = (await response.json().catch(() => null)) as { chatId?: string; reply?: string; error?: string } | null;

      if (!response.ok || !data) {
        setErrorMessage(data?.error ?? "The assistant couldn't respond right now.");
        return;
      }

      if (data.chatId) {
        chatIdRef.current = data.chatId;
      }

      setMessages((previous) => [...previous, { role: "assistant", content: data.reply ?? "" }]);
    } catch {
      setErrorMessage("The assistant couldn't respond right now. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured]);

  const endChat = useCallback(() => {
    persistChat(sessionIdRef.current, messagesRef.current, "COMPLETED", true);
  }, []);

  return {
    isConfigured,
    messages,
    isLoading,
    errorMessage,
    sendMessage,
    endChat,
  };
}
