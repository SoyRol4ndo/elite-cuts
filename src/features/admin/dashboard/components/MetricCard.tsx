import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  color?: "amber" | "emerald" | "blue" | "purple";
  navigateTo: string;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "amber",
  navigateTo,
}: Props) => {
  const colorMap = {
    amber: "text-amber-500 bg-amber-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    blue: "text-blue-500 bg-blue-500/10",
    purple: "text-purple-500 bg-purple-500/10",
  };

  return (
    <Link
      to={`/admin/${navigateTo}`}
      className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
    </Link>
  );
};
