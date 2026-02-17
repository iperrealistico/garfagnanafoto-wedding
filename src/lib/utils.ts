import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatError(error: any): string {
  if (!error) return "An unknown error occurred";

  // If it's a string, check for HTML
  if (typeof error === "string") {
    if (error.trim().startsWith("<!DOCTYPE html>") || error.includes("<html")) {
      return "Critical Server Error (HTML returned). This usually indicates a 404 or a misconfigured route.";
    }
    return error.length > 150 ? error.substring(0, 150) + "..." : error;
  }

  // If it's an object with a message
  if (error.message) {
    if (typeof error.message === 'string' && (error.message.includes("<!DOCTYPE html>") || error.message.includes("<html"))) {
      return "Server responded with an HTML page instead of data. Check server logs.";
    }
    return error.message;
  }

  return "An unexpected error occurred";
}
