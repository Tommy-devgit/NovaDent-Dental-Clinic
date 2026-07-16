export const dynamic = "force-dynamic";

import { conversationLogsRepository } from "../../../../../shared/database";

export default async function ConversationsPage() {
  const conversations = await conversationLogsRepository.listConversations();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Conversations</h2>
        <p className="mt-2 text-sm text-slate-400">Voice calls and transcript logs generated through Vapi.</p>
      </div>

      <div className="space-y-4">
        {conversations.map((conversation) => (
          <article key={conversation.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{conversation.lead.patientName}</p>
                <h3 className="text-lg font-semibold text-white">{conversation.summary ?? "Conversation summary"}</h3>
              </div>
              <p className="text-sm text-slate-400">{conversation.createdAt.toLocaleString()}</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{conversation.transcript}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
