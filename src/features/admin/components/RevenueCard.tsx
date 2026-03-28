import { DollarSign } from "lucide-react";

interface Props {
  metric: string;
  color: string;
  title: string;
}

export const RevenueCard = ({ metric, color, title }: Props) => {
  return (
    <div
      className={`p-6 bg-lineal-to-br from-amber-950/30 to-zinc-900 border border-${color}/20 rounded-2xl`}
    >
      <div className={`flex items-center gap-2 text-${color} mb-3`}>
        <DollarSign className="w-5 h-5" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="text-4xl font-black">
        {/* ${(metrics?.revenue_today ?? 0).toLocaleString()} */}${metric}
      </p>
    </div>
  );
};
