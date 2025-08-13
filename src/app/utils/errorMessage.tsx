export const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object") {
      const obj = error as Record<string, unknown>;
      if (typeof obj.shortMessage === "string") return obj.shortMessage;
      if (typeof obj.message === "string") return obj.message;
    }
    return "Error sending transaction";
  };