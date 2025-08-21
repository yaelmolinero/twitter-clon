import SearchBar from '@/components/layouts/discovery/SearchBar.tsx';

interface Props {
  children: React.ReactNode;
  hideSearch?: boolean;
}

function DiscoverySidebar({ children, hideSearch = false }: Props) {
  return (
    // <div className="hidden lg:block lg:w-[290px] min-[1108px]:w-[350px] mr-2 space-y-4">
    <div className='hidden lg:block lg:w-[290px] xl:w-[350px] mr-2 space-y-4'>
      {!hideSearch && (
        <div className='sticky top-0 pt-2 bg-background z-10'>
          <SearchBar />
        </div>
      )}

      <div className={`sticky ${hideSearch ? 'top-2' : 'top-0'} space-y-4`}>
        {children}

        <div className='text-secondary text-sm px-4 space-x-1'>
          <span>Hecho con ❤️ por</span>
          <a href='https://github.com/yaelmolinero' target='_blank' className='hover:underline'>yaelmolinero</a>
        </div>
      </div>

    </div>
  );
}

export default DiscoverySidebar;
