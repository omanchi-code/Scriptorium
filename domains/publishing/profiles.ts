import { OutputKind } from "@/domains/knowledge/asset-kinds";

export type PublishingProfileId =
  | "book_launch"
  | "academic_paper"
  | "evidence_series"
  | "social_media_campaign"
  | "course_creation"
  | "sermon_package";

export type PublishingProfile = {
  id: PublishingProfileId;
  label: string;
  description: string;
  outputs: OutputKind[];
};

/**
 * A profile just pre-selects an output bundle — expandProfile() below
 * hands that bundle to the same buildPlan() any manual multi-select
 * would use (see ./plan.ts). There's no separate "profile execution
 * path"; a profile is a shortcut to a requestedOutputs array, nothing
 * more.
 *
 * `course_creation` is honest about a real gap: "Course" isn't a real
 * output kind yet (it's one of the reserved future Knowledge Asset
 * kinds — see domains/knowledge/knowledge-asset.ts). Its outputs below
 * are a placeholder built from kinds that exist today, not an actual
 * course-generation capability.
 */
export const PUBLISHING_PROFILES: Record<PublishingProfileId, PublishingProfile> = {
  book_launch: {
    id: "book_launch",
    label: "Book Launch",
    description: "Key art, a trailer, an announcement article, and a newsletter — everything to introduce a new title.",
    outputs: ["cinematic_artwork", "book_trailer", "blog_article", "newsletter", "facebook_post"],
  },
  academic_paper: {
    id: "academic_paper",
    label: "Academic Paper",
    description: "Evidence-first outputs suited to a scholarly reader.",
    outputs: ["evidence_cards", "seo_metadata"],
  },
  evidence_series: {
    id: "evidence_series",
    label: "Evidence Series",
    description: "A run of shareable, numbered evidence cards for ongoing citation-building.",
    outputs: ["evidence_cards", "evidence_card_image"],
  },
  social_media_campaign: {
    id: "social_media_campaign",
    label: "Social Media Campaign",
    description: "Short-form content across platforms from one chapter.",
    outputs: ["youtube_short", "instagram_reel", "facebook_post"],
  },
  course_creation: {
    id: "course_creation",
    label: "Course Creation",
    description:
      "Placeholder using today's real output kinds — a true course-generation capability needs the 'course'/'lecture' Knowledge Asset kinds, which don't exist yet.",
    outputs: ["blog_article", "seo_metadata"],
  },
  sermon_package: {
    id: "sermon_package",
    label: "Sermon Package",
    description: "A speaking script, supporting evidence, and an announcement.",
    outputs: ["podcast_script", "evidence_cards", "newsletter"],
  },
};

export function expandProfile(profileId: PublishingProfileId): OutputKind[] {
  return PUBLISHING_PROFILES[profileId].outputs;
}
