import type { JsonValue } from "@prisma/client/runtime/library";

  export function isJsonValueEmpty(value: JsonValue | null): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === "object") {
      if (Array.isArray(value)) return value.length === 0;
      return Object.keys(value).length === 0;
    }
    return false;
  }