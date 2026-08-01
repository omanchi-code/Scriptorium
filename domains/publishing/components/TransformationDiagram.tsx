"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type DiagramNode = {
  id: string;
  label: string;
  href?: string;
  // Reserved for future reuse as a real publishing workflow (selecting a
  // chapter, choosing a destination, generating an output, tracking
  // status) — not rendered yet, just part of the shape so this component
  // doesn't need reworking when that day comes.
  status?: "idle" | "generating" | "done";
};

const DEFAULT_OUTPUTS: DiagramNode[] = [
  { id: "book", label: "Book" },
  { id: "article", label: "Article" },
  { id: "evidence-library", label: "Evidence Library" },
  { id: "podcast", label: "Podcast" },
  { id: "newsletter", label: "Newsletter" },
  { id: "cinematic-artwork", label: "Cinematic Artwork" },
  { id: "video", label: "Video" },
  { id: "social-content", label: "Social Content" },
  { id: "educational-resources", label: "Educational Resources" },
];

function polarPercent(index: number, total: number, radius: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2; // start at 12 o'clock
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle),
  };
}

// Per-node delays are computed directly (via `custom`) rather than via a
// blanket staggerChildren, so lines draw outward and reveal their output
// one direction at a time, radiating around the circle in sequence.
const STEP = 0.1;
const BASE_DELAY = 0.25;
const LINE_DURATION = 0.55;

const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: LINE_DURATION, ease: "easeInOut" as const, delay: BASE_DELAY + i * STEP },
  }),
};

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
      delay: BASE_DELAY + i * STEP + LINE_DURATION * 0.6,
    },
  }),
};

const centerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const vLineVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.35, ease: "easeInOut" as const, delay: 0.15 + i * 0.12 },
  }),
};

const vNodeVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const, delay: 0.15 + i * 0.12 + 0.15 },
  }),
};

export default function TransformationDiagram({
  centerLabel = "Chapter",
  outputs = DEFAULT_OUTPUTS,
  onSelect,
}: {
  centerLabel?: string;
  outputs?: DiagramNode[];
  onSelect?: (node: DiagramNode) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div>
      {/* DESKTOP — radial */}
      <motion.div
        className="hidden md:block relative mx-auto aspect-square w-full max-w-2xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
          {outputs.map((node, i) => {
            const { x, y } = polarPercent(i, outputs.length, 33);
            const isHovered = hovered === node.id;
            return (
              <motion.line
                key={node.id}
                x1={50}
                y1={50}
                x2={x}
                y2={y}
                stroke="#B8935F"
                strokeWidth={isHovered ? 0.7 : 0.3}
                style={{ transition: "stroke-width 0.25s ease" }}
                variants={lineVariants}
                custom={i}
              />
            );
          })}
        </svg>

        {/* Center node — a gentle continuous pulse, independent of the
            scroll-triggered entrance, suggests the source quietly at rest */}
        <motion.div
          variants={centerVariants}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <motion.div
            animate={{
              scale: [1, 1.035, 1],
              borderColor: hovered ? "#D2A455" : ["#B8935F", "#D2A455", "#B8935F"],
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="bg-vellum border rounded-sm px-7 py-4"
          >
            <span className="font-display text-2xl">{centerLabel}</span>
          </motion.div>
        </motion.div>

        {outputs.map((node, i) => {
          const { x, y } = polarPercent(i, outputs.length, 42);
          const isHovered = hovered === node.id;
          return (
            <motion.button
              key={node.id}
              type="button"
              variants={nodeVariants}
              custom={i}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect?.(node)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-28 text-center bg-transparent border-0 p-0 cursor-default"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span
                className={`tag-pill bg-vellum transition-colors duration-300 ${
                  isHovered ? "border-brass text-brass" : ""
                }`}
              >
                {node.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* MOBILE — vertical flow, same sequencing logic */}
      <motion.div
        className="md:hidden flex flex-col items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={centerVariants} className="mb-2">
          <motion.div
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="bg-vellum border border-brass rounded-sm px-7 py-4"
          >
            <span className="font-display text-2xl">{centerLabel}</span>
          </motion.div>
        </motion.div>

        {outputs.map((node, i) => (
          <div key={node.id} className="flex flex-col items-center">
            <motion.div
              variants={vLineVariants}
              custom={i}
              style={{ transformOrigin: "top" }}
              className="w-px h-8 bg-brass"
            />
            <motion.button
              type="button"
              variants={vNodeVariants}
              custom={i}
              onClick={() => onSelect?.(node)}
              whileTap={{ scale: 0.96 }}
              className="mb-2 bg-transparent border-0 p-0"
            >
              <span className="tag-pill">{node.label}</span>
            </motion.button>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
