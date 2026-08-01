"use client";

import { useRef, useState } from "react";
import { downscaleToJpegBase64 } from "../image-processing";

export type UploadStatus = "idle" | "reading" | "error";

export function useStudioUpload(onExtracted: (text: string) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setStatus("reading");
    setError(null);
    try {
      const { base64, mediaType } = await downscaleToJpegBase64(file);
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Transcription failed.");
        return;
      }
      onExtracted(data.text);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Transcription failed.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function triggerFilePicker() {
    inputRef.current?.click();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return { inputRef, status, error, triggerFilePicker, handleInputChange };
}
