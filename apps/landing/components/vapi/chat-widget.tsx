"use client";

import { Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button, Input } from "@novadent/ui";

import { OPEN_ASSISTANT_EVENT } from "@/lib/assistant-events";
import { useNovadentChat } from "@/lib/use-novadent-chat";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [textValue, setTextValue] = useState("");
  const chat = useNovadentChat();
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOpenRequest() {
      setIsOpen(true);
    }

    window.addEventListener(OPEN_ASSISTANT_EVENT, handleOpenRequest);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, handleOpenRequest);
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, chat.isLoading]);

  function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = textValue.trim();
    if (!trimmed) return;

    setTextValue("");
    void chat.sendMessage(trimmed);
  }

  function handleClose() {
    setIsOpen(false);
    chat.endChat();
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="absolute bottom-[calc(100%+1rem)] right-0 flex h-120 w-80 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:w-96">
          <div className="flex items-center justify-between gap-3 border-b border-border p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <p className="text-sm font-semibold text-foreground">Chat</p>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close chat"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {!chat.isConfigured ? (
              <p className="text-center text-sm text-muted-foreground">
                Chat isn&apos;t available right now — please use the contact form instead.
              </p>
            ) : chat.messages.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Ask us anything — send a message to get started.
              </p>
            ) : (
              chat.messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.role === "assistant"
                      ? "max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm leading-6 text-foreground"
                      : "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm leading-6 text-primary-foreground"
                  }
                >
                  {message.content}
                </div>
              ))
            )}
            {chat.isLoading ? (
              <div className="flex max-w-[85%] items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            ) : null}
            {chat.errorMessage ? <p className="text-center text-xs text-destructive">{chat.errorMessage}</p> : null}
            <div ref={transcriptEndRef} />
          </div>

          {chat.isConfigured ? (
            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
              <Input
                value={textValue}
                onChange={(event) => setTextValue(event.target.value)}
                placeholder="Type a message…"
                aria-label="Type a message"
                disabled={chat.isLoading}
              />
              <Button type="submit" size="icon" aria-label="Send message" disabled={!textValue.trim() || chat.isLoading}>
                {chat.isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </form>
          ) : null}
        </div>
      ) : null}

      <Button
        size="lg"
        onClick={() => setIsOpen((value) => !value)}
        className="rounded-full shadow-lg"
        aria-expanded={isOpen}
        aria-label="Open chat"
      >
        <MessageCircle className="size-4" />
        Chat
      </Button>
    </div>
  );
}
