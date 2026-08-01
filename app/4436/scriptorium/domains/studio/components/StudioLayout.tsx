"use client";

import { useStudioGeneration } from "../hooks/useStudioGeneration";
import StudioToolbar from "./StudioToolbar";
import StudioResults from "./StudioResults";
import { SAMPLE_TEXT } from "../constants";

export default function StudioLayout() {
  const {
    chapterTitle,
    setChapterTitle,
    bookLabel,
    setBookLabel,
    chapterText,
    setChapterText,
    cards,
    expandedKind,
    toggleExpanded,
    generateOne,
    generateAll,
    generatingAll,
  } = useStudioGeneration();

  return (
    <div>
      <StudioToolbar
        bookLabel={bookLabel}
        onBookLabelChange={setBookLabel}
        chapterTitle={chapterTitle}
        onChapterTitleChange={setChapterTitle}
        chapterText={chapterText}
        onChapterTextChange={setChapterText}
        onGenerateAll={generateAll}
        generatingAll={generatingAll}
        placeholder={SAMPLE_TEXT}
      />
      <StudioResults
        cards={cards}
        expandedKind={expandedKind}
        onToggleExpanded={toggleExpanded}
        onGenerateOne={generateOne}
      />
    </div>
  );
}
