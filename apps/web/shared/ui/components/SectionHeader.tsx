interface SectionHeaderProps {
  title: string;
  count: number;
}

export function SectionHeader({ title, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">
        {count}
      </span>
    </div>
  );
}
