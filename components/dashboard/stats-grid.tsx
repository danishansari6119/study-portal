// components/dashboard/stats-grid.tsx
"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  color: "blue" | "purple" | "green" | "orange" | "red";
}

const colorMap = {
  blue: "from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
  purple: "from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
  green: "from-green-500/20 to-green-600/10 border-green-500/20 text-green-600 dark:text-green-400",
  orange: "from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-600 dark:text-orange-400",
  red: "from-red-500/20 to-red-600/10 border-red-500/20 text-red-600 dark:text-red-400",
};

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={cn(
            "stat-card bg-gradient-to-br border rounded-2xl",
            colorMap[stat.color]
          )}
        >
          <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
          <div className="flex items-center gap-1">
            {stat.trend === "up" && <TrendingUp size={12} className="text-green-500" />}
            {stat.trend === "down" && <TrendingDown size={12} className="text-red-500" />}
            {stat.trend === "neutral" && <Minus size={12} className="text-muted-foreground" />}
            <span className="text-xs text-muted-foreground">{stat.change}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
