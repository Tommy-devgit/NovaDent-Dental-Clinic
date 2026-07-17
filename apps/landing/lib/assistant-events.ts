export const OPEN_ASSISTANT_EVENT = "novadent:open-assistant";

export function openAssistant() {
  window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT));
}
