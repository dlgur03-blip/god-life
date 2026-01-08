import { CATEGORY_COLORS, type BioCategory } from '@/types/bio';

type Props = {
  category: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
};

export default function CategoryBadge({
  category,
  size = 'sm',
  showDot = true
}: Props) {
  const color = CATEGORY_COLORS[category as BioCategory] || '#10b981';

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-1'
    : 'text-sm px-3 py-1.5';

  return (
    <span
      className={`font-bold uppercase tracking-widest rounded flex items-center gap-1.5 w-fit ${sizeClasses}`}
      style={{
        color: color,
        borderColor: `${color}30`,
        borderWidth: '1px'
      }}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {category}
    </span>
  );
}
