import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { pollRunwayVideoTask } from "@/domains/publishing/async-tasks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Sign in at /login first." }, { status: 401 });
  }

  const taskId = req.nextUrl.searchParams.get("taskId");
  const provider = req.nextUrl.searchParams.get("provider");

  if (!taskId || provider !== "runway") {
    return NextResponse.json({ error: "Missing or unsupported taskId/provider." }, { status: 400 });
  }

  const result = await pollRunwayVideoTask(taskId);

  if (result.status === "error") {
    return NextResponse.json({ status: "error", error: result.error });
  }
  return NextResponse.json(result);
}
