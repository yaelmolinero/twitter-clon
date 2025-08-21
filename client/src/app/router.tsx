import { Routes, Route, useLocation, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';

import { ProtectedRoute } from '@/lib/auth.tsx';
import MainLayout from '@/components/layouts/MainLayout.tsx';
const ModalCloseProvider = lazy(() => import('@/contexts/modalCloseContext/ModalCloseContext.tsx'));
const ModalLayout = lazy(() => import('@/components/layouts/ModalLayout.tsx'));
const NotFound = lazy(() => import('@/app/routes/NotFoundPage.tsx'));

const Home = lazy(() => import('@/app/routes/Home.tsx'));
const Status = lazy(() => import('@/app/routes/app/Status.tsx'));
const Explore = lazy(() => import('@/app/routes/app/Explore.tsx'));
const Search = lazy(() => import('@/app/routes/app/Search.tsx'));
const ConnectPeople = lazy(() => import('@/app/routes/app/ConnectPeople.tsx'));
const Notifications = lazy(() => import('@/app/routes/app/Notifications.tsx'));
const Bookmarks = lazy(() => import('@/app/routes/app/Bookmarks.tsx'));

const Profile = lazy(() => import('@/app/routes/app/Profile.tsx'));
const ProfilePosts = lazy(() => import('@/features/user/components/profileFeed/ProfilePosts.tsx'));
const ProfileReplies = lazy(() => import('@/features/user/components/profileFeed/ProfileReplies.tsx'));
const ProfileMultimedia = lazy(() => import('@/features/user/components/profileFeed/ProfileMultimedia.tsx'));
const UserLikes = lazy(() => import('@/features/user/components/profileFeed/UserLikes.tsx'));
const Follows = lazy(() => import('@/features/user/components/Follows.tsx'));

const TweetImageModal = lazy(() => import('@/app/routes/modals/TweetImageModal.tsx'));
const ComposeTweet = lazy(() => import('@/app/routes/modals/ComposeTweet.tsx'));
const ReplyTweetModal = lazy(() => import('@/app/routes/modals/ReplyTweetModal.tsx'));
const EditProfile = lazy(() => import('@/app/routes/modals/EditProfile.tsx'));
const Photo = lazy(() => import('@/app/routes/modals/Photo.tsx'));
const Cover = lazy(() => import('@/app/routes/modals/Cover.tsx'));

const Login = lazy(() => import('@/app/routes/auth/Login.tsx'));
const Signup = lazy(() => import('@/app/routes/auth/Signup.tsx'));
import LoadingApp from '@/components/ui/LoadingApp.tsx';

import { paths } from '@/config/paths.ts';

export function AppRouter() {
  const location = useLocation();
  const background = (location.state as { backgroundLocation?: Location })?.backgroundLocation;

  return (
    <Suspense fallback={<LoadingApp />}>
      <Routes location={background || location} >
        <Route
          path={paths.app.root.path}
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={paths.app.home.getHref()} replace />} />
          <Route path={paths.app.home.path} element={<Home />} />
          <Route path={paths.app.explore.path} element={<Explore />} />
          <Route path={paths.app.search.path} element={<Search />} />
          <Route path={paths.app.connectPeople.path} element={<ConnectPeople />} />
          <Route path={paths.app.notifications.path} element={<Notifications />} />
          <Route path={paths.app.bookmarks.path} element={<Bookmarks />} />
          <Route path={paths.app.profile.path} element={<Profile />}>
            <Route index element={<ProfilePosts />} />
            <Route path={paths.app.profile.tabs.replies.path} element={<ProfileReplies />} />
            <Route path={paths.app.profile.tabs.multimedia.path} element={<ProfileMultimedia />} />
            <Route path={paths.app.profile.tabs.likes.path} element={<UserLikes />} />
            <Route path={paths.app.profile.photo.path} element={<Navigate to={paths.app.home.getHref()} replace />} />
            <Route path={paths.app.profile.cover.path} element={<Navigate to={paths.app.home.getHref()} replace />} />
          </Route>

          <Route path={paths.app.profile.followers.path} element={<Follows type='followers' />} />
          <Route path={paths.app.profile.following.path} element={<Follows type='following' />} />
        </Route>

        {/* <Route path={paths.app.status.path} element={<Status />}> */}
        <Route path={paths.app.status.path} element={
          <ProtectedRoute>
            <Status />
          </ProtectedRoute>
        }>
          <Route path={paths.app.status.image.path} element={<TweetImageModal />} />
        </Route>

        <Route path={paths.auth.login.path} element={<Login />} />
        <Route path={paths.auth.signup.path} element={<Signup />} />

        <Route path={paths.app.post.path} element={<Navigate to={paths.app.home.getHref()} replace />} />
        <Route path={paths.app.settings.profile.path} element={<Navigate to={paths.app.home.getHref()} replace />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      {background && (
        <Routes>
          <Route path='/' element={<ModalCloseProvider children={<ModalLayout />} />}>
            <Route path={paths.app.status.image.fullPath} element={<TweetImageModal />} />
            <Route path={paths.app.post.path} element={location.state.replying ? <ReplyTweetModal /> : <ComposeTweet />} />
            <Route path={paths.app.settings.profile.path} element={<EditProfile />} />
            <Route path={paths.app.profile.photo.fullPath} element={<Photo />} />
            <Route path={paths.app.profile.cover.fullPath} element={<Cover />} />
          </Route>
        </Routes>
      )}
    </Suspense>
  );
}
