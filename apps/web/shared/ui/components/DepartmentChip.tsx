interface DepartmentChipProps {
  label: string;
}

export function DepartmentChip({ label }: DepartmentChipProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 text-xs bg-muted text-muted-foreground rounded-md font-medium">
      {label}
    </span>
  );
}
