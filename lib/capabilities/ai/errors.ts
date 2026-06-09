export type AiCapabilityErrorCode =
  | "anthropic_not_configured"
  | "openai_not_configured";

export class AiCapabilityError extends Error {
  constructor(readonly code: AiCapabilityErrorCode) {
    super(code);
    this.name = "AiCapabilityError";
  }
}
