import type { QueryParams } from '@/types/types.d.ts';
import type { TweetIDType, UsernameType } from '@/types/types.d.ts';

export const paths = {
  app: {
    root: {
      path: '/',
      getHref: () => '/'
    },
    home: {
      path: 'home',
      getHref: () => '/home'
    },
    notifications: {
      path: 'notifications',
      getHref: () => '/notifications'
    },
    bookmarks: {
      path: 'bookmarks',
      getHref: () => '/bookmarks'
    },
    explore: {
      path: 'explore',
      getHref: () => '/explore'
    },
    search: {
      path: 'search',
      getHref: ({ q, tab }: QueryParams) => `/search?q=${q + (tab ? `&tab=${tab}` : '')}`
    },
    connectPeople: {
      path: 'i/connect_people',
      getHref: () => '/i/connect_people'
    },
    post: {
      path: 'compose/post',
      getHref: () => '/compose/post'
    },
    status: {
      path: ':username/status/:tweetID',
      getHref: (username: UsernameType, tweetID: TweetIDType) => `/${username}/status/${tweetID}`,

      image: {
        path: 'photo',
        fullPath: ':username/status/:tweetID/photo',
        getHref: (username: UsernameType, tweetID: TweetIDType) => `/${username}/status/${tweetID}/photo`
      }
    },
    profile: {
      path: ':username',
      getHref: (username: UsernameType) => `/${username}`,

      followers: {
        path: ':username/followers',
        getHref: (username: UsernameType) => `/${username}/followers`
      },
      following: {
        path: ':username/following',
        getHref: (username: UsernameType) => `/${username}/following`
      },

      photo: {
        path: 'photo',
        fullPath: ':username/photo',
        getHref: (username: UsernameType) => `/${username}/photo`
      },
      cover: {
        path: 'header_photo',
        fullPath: ':username/header_photo',
        getHref: (username: UsernameType) => `/${username}/header_photo`
      },

      tabs: {
        replies: {
          path: 'with_replies',
          getHref: (username: UsernameType) => `/${username}/with_replies`
        },
        multimedia: {
          path: 'multimedia',
          getHref: (username: UsernameType) => `/${username}/multimedia`
        },
        likes: {
          path: 'likes',
          getHref: (username: UsernameType) => `/${username}/likes`
        }
      },
    },
    settings: {
      profile: {
        path: 'settings/profile',
        getHref: () => '/settings/profile'
      }
    }
  },
  auth: {
    login: {
      path: '/login',
      getHref: (redirectTo?: string) => `/login${redirectTo ? `?redirectTo=${redirectTo}` : ''}`
    },
    signup: {
      path: '/signup',
      getHref: (redirectTo?: string) => `/signup${redirectTo ? `?redirectTo=${redirectTo}` : ''}`
    }
  }
} as const;