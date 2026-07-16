"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-sm flex-col items-end gap-3">
      {isOpen ? (
        <div className="w-[20rem] rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-2xl shadow-slate-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">{data?.assistantName ?? "NovaDent Assistant"}</p>
              <p className="text-xs text-slate-500">{isLoading ? "Loading status..." : data?.status ?? "Ready"}</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-sm text-slate-500 transition hover:text-slate-900">
              Close
            </button>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
            <p className="text-sm leading-6">
              {isError
                ? "The assistant connection is temporarily unavailable. Please use the contact form or try again shortly."
                : "Tap start to open the voice assistant. Patient intake is routed through Vapi and n8n automatically."}
            </p>
          </div>
          <button className="mt-4 w-full rounded-full bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800">
            {data?.ctaLabel ?? "Start voice conversation"}
          </button>
        </div>
      ) : null}

      <button
        onClick={() => setIsOpen((value) => !value)}
        className="rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-950/20 transition hover:scale-[1.02]"
      >
        Talk to AI Assistant
      </button>
    </div>
  );
}