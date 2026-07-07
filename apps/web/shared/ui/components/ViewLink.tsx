interface ViewLinkProps {
  onClick: () => void;
}

export function ViewLink({ onClick }: ViewLinkProps) {
  return (
    <button
      onClick={onClick}
      className="text-primary text-sm font-medium cursor-pointer hover:underline"
    >
      View
    </button>
  );
}
