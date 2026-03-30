import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind + conditional classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Check if app is running inside iframe
 * Safe for Next.js SSR
 */
export const isIframe =
    typeof window !== "undefined" && window.self !== window.top;