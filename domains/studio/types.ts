import { OutputKind } from "@/domains/knowledge/asset-kinds";
export type StudioStatus = "idle" | "loading" | "processing" | "done" | "error";

/** What a single output card needs to render — nothing more. Built by
 * useStudioGeneration from the raw API response; components never see
 * the raw response shape. */
export type StudioCardViewModel = {
  kind: OutputKind;
  label: string;
  description: string;
  status: StudioStatus;
  content?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  error?: string;
};

/** What a single history entry needs to render. Built by
 * useStudioHistory — the raw Generation row's `kind` string is already
 * resolved to a human label here, so the component never imports the
 * Knowledge domain to look it up itself.
 *
 * `sessionId` is exposed but not used for grouping in the UI yet — the
 * list stays flat, most-recent-first, exactly as before. Grouping by
 * publishing session is a real, available next step, deliberately not
 * done here since it would change the History panel's layout. */
export type StudioHistoryItemViewModel = {
  id: string;
  sessionId: string | null;
  kindLabel: string;
  chapterTitle: string;
  status: "done" | "processing" | "error";
  errorMessage: string | null;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
};
