import type { IconProps } from '@/types/types.d.ts';

function LeftRowIcon({ className }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g>
    </svg>
  );
}

export default LeftRowIcon;
