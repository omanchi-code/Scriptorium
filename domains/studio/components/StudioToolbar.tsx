"use client";

import StudioUpload from "./StudioUpload";
import ActionButton from "@/components/ui/ActionButton";

export default function StudioToolbar({
  bookLabel,
  onBookLabelChange,
  chapterTitle,
  onChapterTitleChange,
  chapterText,
  onChapterTextChange,
  onGenerateAll,
  generatingAll,
  placeholder,
}: {
  bookLabel: string;
  onBookLabelChange: (value: string) => void;
  chapterTitle: string;
  onChapterTitleChange: (value: string) => void;
  chapterText: string;
  onChapterTextChange: (value: string) => void;
  onGenerateAll: () => void;
  generatingAll: boolean;
  placeholder: string;
}) {
  return (
    <div className="hairline pt-10 grid gap-6 mb-16">
      <div className="grid sm:grid-cols-[10rem_1fr] gap-6">
        <div>
          <label htmlFor="bookLabel" className="eyebrow block mb-2">
            Book label
          </label>
          <input
            id="bookLabel"
            value={bookLabel}
            onChange={(e) => onBookLabelChange(e.target.value)}
            className="w-full bg-transparent border border-rule px-4 py-3 text-ink focus:border-brass outline-none transition-colors duration-300"
          />
        </div>
        <div>
          <label htmlFor="chapterTitle" className="eyebrow block mb-2">
            Chapter title
          </label>
          <input
            id="chapterTitle"
            value={chapterTitle}
            onChange={(e) => onChapterTitleChange(e.target.value)}
            className="w-full bg-transparent border border-rule px-4 py-3 text-ink focus:border-brass outline-none transition-colors duration-300"
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="chapterText" className="eyebrow">
            Chapter text
          </label>
          <StudioUpload onExtracted={onChapterTextChange} />
        </div>
        <textarea
          id="chapterText"
          rows={8}
          value={chapterText}
          onChange={(e) => onChapterTextChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border border-rule px-4 py-3 text-ink placeholder:text-ink-dim/60 focus:border-brass outline-none transition-colors duration-300 resize-y"
        />
        <p className="font-mono text-[11px] text-ink-dim mt-2">
          Scanning a page replaces the text above with what's transcribed from the photo.
        </p>
      </div>
      <div>
        <ActionButton onClick={onGenerateAll} disabled={generatingAll}>
          {generatingAll ? "Generating…" : "Generate content"}
        </ActionButton>
      </div>
    </div>
  );
}
