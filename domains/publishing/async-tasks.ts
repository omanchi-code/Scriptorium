import { getRunwayTask } from "@/domains/publishing/providers/runway";
import { prisma } from "@/lib/prisma";

export type AsyncTaskResult =
  | { status: "processing" }
  | { status: "done"; mediaUrl: string; mediaType: "video" }
  | { status: "error"; error: string };

/** Polls a Runway task and, if it just finished, fills in the mediaUrl on
 * the Generation row created when the task started (matched by taskId).
 * The route handler doesn't touch Prisma directly — this is the one
 * place that persists the result of an async task. */
export async function pollRunwayVideoTask(taskId: string): Promise<AsyncTaskResult> {
  const runwayKey = process.env.RUNWAY_API_KEY;
  if (!runwayKey) {
    return { status: "error", error: "RUNWAY_API_KEY is not set." };
  }

  const result = await getRunwayTask(runwayKey, taskId);

  if (result.state === "processing") {
    return { status: "processing" };
  }
  if (result.state === "error") {
    await prisma.generation
      .update({ where: { taskId }, data: { status: "error", errorMessage: result.message } })
      .catch(() => undefined);
    return { status: "error", error: result.message };
  }

  await prisma.generation
    .update({ where: { taskId }, data: { mediaUrl: result.url, status: "done" } })
    .catch(() => undefined); // best-effort — the client still gets its video either way

  return { status: "done", mediaUrl: result.url, mediaType: "video" };
}
