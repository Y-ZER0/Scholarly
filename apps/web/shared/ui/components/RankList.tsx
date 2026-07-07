interface RankItem {
  rank: number;
  title: string;
  subtitle: string;
  newBadge?: boolean;
  countBadge?: number;
}

interface RankListProps {
  title: string;
  items: RankItem[];
}

export function RankList({ title, items }: RankListProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-0">
        {items.map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0"
          >
            <span className="text-xs text-muted-foreground w-6 shrink-0 font-medium">
              #{item.rank}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
            </div>
            {item.newBadge && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded shrink-0">
                New
              </span>
            )}
            {item.countBadge !== undefined && (
              <span className="text-xs bg-primary text-white px-2.5 py-0.5 rounded font-semibold shrink-0">
                {item.countBadge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
