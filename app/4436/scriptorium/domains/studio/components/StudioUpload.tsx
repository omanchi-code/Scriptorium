"use client";

import { useStudioUpload } from "../hooks/useStudioUpload";
import ActionButton from "@/components/ui/ActionButton";

export default function StudioUpload({ onExtracted }: { onExtracted: (text: string) => void }) {
  const { inputRef, status, error, triggerFilePicker, handleInputChange } =
    useStudioUpload(onExtracted);

  return (
    <div className="flex items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      <ActionButton small onClick={triggerFilePicker} disabled={status === "reading"}>
        {status === "reading" ? "Reading page…" : "Scan a page photo"}
      </ActionButton>
      {error && <p className="font-mono text-xs text-crimson">{error}</p>}
    </div>
  );
}
