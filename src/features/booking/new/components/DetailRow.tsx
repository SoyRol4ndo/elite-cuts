interface Props {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export const DetailRow = ({ label, value, icon }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-zinc-400 text-sm">
        {icon}
        {label}
      </div>
      <span className="text-sm font-medium capitalize">{value}</span>
    </div>
  );
};
