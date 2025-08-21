import type { IconProps } from '@/types/types.d.ts';

function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
    </svg>
  );
}

export default CloseIcon;
