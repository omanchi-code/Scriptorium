import { callClaudeVision } from "@/domains/publishing/providers/anthropic";

const TRANSCRIPTION_INSTRUCTION =
  "Transcribe all the text visible on this page exactly as written, preserving " +
  "paragraph breaks and any chapter or section headings. If part of the text is " +
  "cut off, blurry, or unreadable, note that briefly in brackets rather than " +
  "guessing. Return only the transcribed text, nothing else.";

/** Reads the text off a photographed book page. This is Studio's input
 * side (turning a photo into chapter text), distinct from the Publishing
 * domain's job (turning chapter text into published outputs) — a chapter
 * hasn't entered the Publishing Engine yet at this point. */
export async function transcribePageImage(imageBase64: string, mediaType: string) {
  return callClaudeVision(imageBase64, mediaType, TRANSCRIPTION_INSTRUCTION);
}
