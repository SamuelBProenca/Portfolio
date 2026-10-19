export class ContactServiceError extends Error {
  constructor(
    readonly code: string,
    readonly providerStatus?: number,
    readonly providerCode?: string,
  ) {
    super(code);
    this.name = "ContactServiceError";
  }
}

export function reportContactFailure(fallback: string, error?: unknown) {
  // Only fields constructed by this module are logged. Never serialize raw
  // errors, provider response bodies, credentials or visitor input.
  console.error(
    "[contact]",
    error instanceof ContactServiceError
      ? { code: error.code, providerStatus: error.providerStatus, providerCode: error.providerCode }
      : { code: fallback },
  );
}
