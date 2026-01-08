type Props = {
  category: string;
};

export default function CategoryBadge({ category }: Props) {
  return (
    <span className="text-xs font-bold text-green-400 uppercase tracking-widest border border-green-400/30 px-2 py-1 rounded">
      {category}
    </span>
  );
}
