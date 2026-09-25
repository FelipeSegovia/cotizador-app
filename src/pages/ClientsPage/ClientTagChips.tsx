type ClientTagChipsProps = {
  tags: string[];
  className?: string;
};

const ClientTagChips = ({ tags, className = "" }: ClientTagChipsProps) => {
  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`.trim()}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default ClientTagChips;
