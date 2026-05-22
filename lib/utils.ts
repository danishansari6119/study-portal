// lib/utils.ts
// Shared utility functions

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format date to readable string */
export function formatDate(date: Date | string, pattern = "MMM dd, yyyy") {
  return format(new Date(date), pattern);
}

/** Relative time (e.g. "2 hours ago") */
export function timeAgo(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/** Calculate attendance percentage */
export function calcAttendancePercent(present: number, total: number) {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}

/** Get grade from percentage */
export function getGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

/** Truncate long text */
export function truncate(text: string, length = 50) {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/** Format file size */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Generate avatar initials */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Capitalize first letter */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Days of week label */
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/** Subject color map for consistent UI */
export const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Physics: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Chemistry: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  English: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  History: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  Computer: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function getSubjectColor(subject: string) {
  return SUBJECT_COLORS[subject] || SUBJECT_COLORS.default;
}
