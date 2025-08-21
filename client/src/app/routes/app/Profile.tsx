import { useProfile } from '@/features/user/api/get-profile.ts';
import { useLocation, useParams, Link, Outlet } from 'react-router';
import { usePageTitle } from '@/hooks/usePageTitle.ts';

import Navbar from '@/components/ui/Navbar.tsx';
import ProfileImage from '@/components/ui/ProfileImage.tsx';
import FollowButton from '@/features/user/components/FollowButton.tsx';
import FormatTextContet from '@/components/ui/FormatTextContent.tsx';
import FilterNavbar from '@/components/ui/FilterNavbar.tsx';
import FollowsLink from '@/components/ui/FollowsLink.tsx';

import Divisor from '@/components/ui/Divisor.tsx';
import ProfileNotFound from '@/components/errors/ProfileNotFound.tsx';
import Spinner from '@/components/ui/Spinner.tsx';
import { LocationIcon, LinkIcon, CalendarIcon } from '@/assets/icons';

import { formatJoinedtDate } from '@/utils/format.ts';
import { paths } from '@/config/paths.ts';

import type { FilterNavbarLinks } from '@/types/types.d.ts';

function Profile() {
  const { username: usernameFromParams = 'guest' } = useParams();
  const { data, isLoading, isError, hasPrevData, userBasic } = useProfile({ username: usernameFromParams });
  const location = useLocation();

  const pageTitle = data ? `${data.name} (@${data.username})` : 'Perfil';
  usePageTitle(pageTitle);

  // Si no hay datos ni placeholder, muestra spinner
  if (isLoading && !hasPrevData && !data) return (
    <div>
      <Navbar type='navigation' label='Perfil' />
      <Spinner loadingContainer />
    </div>
  );
  if (isError) return <ProfileNotFound />;
  const { name, username, bio } = userBasic;

  const profileNavigation: FilterNavbarLinks = [
    { label: 'Posts', href: paths.app.profile.getHref(username) },
    { label: 'Respuestas', href: paths.app.profile.tabs.replies.getHref(username) },
    { label: 'Multimedia', href: paths.app.profile.tabs.multimedia.getHref(username) },
  ];
  if (data?.isSessionAcount) profileNavigation.push({ label: 'Me gusta', href: paths.app.profile.tabs.likes.getHref(data.username) });

  return (
    <div>
      <Navbar type='navigation' label={name} />

      <div>
        <div className={`w-full h-[200px] ${!data?.cover && 'bg-borderColor'}`}>
          {(data && data.cover) && (
            <Link to={paths.app.profile.cover.getHref(data.username)} state={{ backgroundLocation: location, user: data }}>
              <div className='w-full h-full'>
                <img
                  src={data.cover}
                  alt='Imagen de portada'
                  className='object-contain'
                />
              </div>
            </Link>
          )}
        </div>

        <div className='px-4 py-3'>
          {/* Foto de perfil y boton de seguir. */}
          <div className='flex relative justify-end h-fit mb-3'>
            <div className='absolute left-0 -bottom-1/5 size-35 border-4 border-background rounded-full bg-[#f7f9f9] dark:bg-[#16181C]'>
              <Link
                to={paths.app.profile.photo.getHref(username)}
                state={{ user: data, backgroundLocation: location }}
                children={<ProfileImage user={userBasic} size='object-contain' disabled disableUserPopup />}
              />
            </div>

            {/* Boton */}
            <div className='h-11'>
              {(data && !data.isSessionAcount && data.userMeta) && <FollowButton userID={data.id} userMeta={data.userMeta} />}
              {(data && data.isSessionAcount) && (
                <Link
                  to={paths.app.settings.profile.getHref()}
                  state={{
                    backgroundLocation: location,
                    user: { cover: data.cover, location: data.location, website: data.website }
                  }}
                  className='block px-4 py-2 border-1 border-borderColor rounded-full cursor-pointer hover:bg-hoverColorSecondary transition-colors duration-200'
                >
                  <span className='font-semibold text-primary'>Editar perfil</span>
                </Link>
              )}
            </div>
          </div>

          <div className='py-3 leading-5'>
            <div>
              <span className='font-bold text-primary text-xl'>{name}</span>
            </div>
            <span className='text-secondary'>@{username}</span>
          </div>

          {isLoading && <Spinner loadingContainer />}
          {bio && <FormatTextContet text={bio} preWrap />}

          {data && (
            <div className='text-secondary flex gap-2 flex-wrap leading-5 my-3'>
              {data.location && (
                <div>
                  <span className='flex items-center gap-1'>
                    <LocationIcon className='size-5' />
                    <span>{data.location}</span>
                  </span>
                </div>
              )}

              {data.website && (
                <div>
                  <span className='flex items-center gap-1'>
                    <LinkIcon className='size-5' />
                    <a
                      href={data.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-twitterBlue hover:underline'
                    >{data.website.replace(/^https?:\/\/(www\.)?/, '')}</a>
                  </span>
                </div>
              )}

              <div>
                <span className='flex items-center gap-1'>
                  <CalendarIcon className='size-5' />
                  <span>{formatJoinedtDate(data.createdAt)}</span>
                </span>
              </div>
            </div>
          )}

          <div className='flex gap-4'>
            <FollowsLink
              type='following'
              username={username}
              value={data?.following ?? 0}
            />

            <FollowsLink
              type='followers'
              username={username}
              value={data?.followers ?? 0}
            />
          </div>
        </div>
      </div>

      <FilterNavbar filters={profileNavigation} />
      <Divisor />

      <Outlet />
    </div>
  );
}

export default Profile;
