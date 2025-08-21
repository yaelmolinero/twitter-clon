import { Link } from 'react-router';
import { paths } from '@/config/paths.ts';

interface Props {
  label: string;
  isActive: boolean;
  handleClick: () => void;
}

function HomeNavLink({ label, isActive, handleClick }: Props) {
  const unfocusTabStyle = 'text-secondary';
  const focusTabStyle = 'font-bold text-primary';

  return (
    <div className="flex-1">
      <Link
        to={paths.app.home.getHref()}
        onClick={handleClick}
        className={`w-full flex md:flex-col items-center justify-center px-4 hover:bg-black/3 dark:hover:bg-white/3 transition-colors duration-200 ${isActive ? focusTabStyle : unfocusTabStyle}`}
      >
        <div className="flex-1 md:flex-auto">
          <div className="flex justify-center py-4 relative">
            <span>{label}</span>
            {isActive && <div className="absolute min-w-14 w-full h-1 rounded-full bottom-0 bg-twitterBlue"></div>}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HomeNavLink;
