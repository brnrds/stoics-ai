import { createOpenAI } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import {
  streamText,
  convertToModelMessages,
  type UIMessage,
  type JSONSchema7,
  type ToolSet,
} from "ai";

import { resolveCurrentAccountContext } from "@/lib/account-context";
import { getOpenAiApiKey } from "@/lib/capabilities/ai/access";
import { AiCapabilityError } from "@/lib/capabilities/ai/errors";

export const maxDuration = 30;
export const runtime = "nodejs";

export async function POST(req: Request) {
  const result = await resolveCurrentAccountContext();

  if (result.status === "unauthenticated") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (result.status === "account_required") {
    return Response.json({ error: "Account required" }, { status: 428 });
  }

  let apiKey: string;
  try {
    apiKey = await getOpenAiApiKey(result.account);
  } catch (error) {
    if (error instanceof AiCapabilityError) {
      return Response.json({ error: error.code }, { status: 424 });
    }

    return Response.json({ error: "Unable to load provider key" }, { status: 502 });
  }

  const openai = createOpenAI({ apiKey });

  const {
    messages,
    system,
    tools,
  }: {
    messages: UIMessage[];
    system?: string;
    tools?: Record<string, { description?: string; parameters: JSONSchema7 }>;
  } = await req.json();

  const streamResult = streamText({
    model: openai("gpt-4o"),
    messages: await convertToModelMessages(messages),
    tools: frontendTools(tools ?? {}) as ToolSet,
    ...(system === undefined ? {} : { instructions: system }),
  });

  return streamResult.toUIMessageStreamResponse();
}
