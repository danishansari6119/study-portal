// components/dashboard/announcements-list.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  createdAt: Date;
}

const priorityColor: Record<string, string> = {
  URGENT: "text-red-600 bg-red-100 dark:bg-red-900/30",
  HIGH:   "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
  NORMAL: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  LOW:    "text-gray-600 bg-gray-100 dark:bg-gray-800",
};

export function AnnouncementsList({ announcements }: { announcements: Announcement[] }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone size={14} className="text-muted-foreground" />
        <h3 className="font-semibold text-sm">Announcements</h3>
      </div>

      {announcements.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No announcements</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium leading-snug">{a.title}</p>
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full shrink-0", priorityColor[a.priority] || priorityColor.NORMAL)}>
                  {a.priority.toLowerCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{a.content}</p>
              <p className="text-xs text-muted-foreground/60">
                {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
