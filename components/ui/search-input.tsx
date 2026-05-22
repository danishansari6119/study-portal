// components/ui/search-input.tsx
"use client";
import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

export function SearchInput({ placeholder = "Search...", defaultValue = "" }: { placeholder?: string; defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("q", term);
    else params.delete("q");
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="relative flex-1 max-w-sm">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
      />
      {isPending && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">...</span>}
    </div>
  );
}
