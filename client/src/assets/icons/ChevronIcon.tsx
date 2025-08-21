import type { IconProps } from '@/types/types.d.ts';

function ChevronIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="currentColor">
      <g><path d="M11.59 12L3.54 3.96l1.42-1.42L14.41 12l-9.45 9.46-1.42-1.42L11.59 12zm7 0l-8.05-8.04 1.42-1.42L21.41 12l-9.45 9.46-1.42-1.42L18.59 12z"></path></g>
    </svg>
  );
}

export default ChevronIcon;
