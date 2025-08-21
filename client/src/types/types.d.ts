// Types de los datos de usuarios
export type UserIDType = string;
export type NameType = string;
export type UsernameType = string;
export type EmailType = string;
export type PasswordType = string;
export type AvatarType = string | null;
export type CoverType = string | null;
export type BioType = string | null;
export type LocationType = string | null;
export type WebsiteType = string | null;
export type CreatedAtType = string;

// Types de los datos de tweets
export type TweetIDType = string;
export type ParentTweetIDType = TweetIDType | null;
export type ContentType = string;
export type ImageUrlType = string | null;
export type DeletedAt = string | null;

export interface IconProps {
  className?: string;
}

export interface SidebarIconProps extends IconProps {
  isActive?: boolean;
}

export type QueryTabs = 'post' | 'user' | 'media' | undefined;
export type QueryParams = { q: string, tab?: QueryTabs };
export type FilterNavbarLinks = { label: string, href: string, tab?: QueryTabs }[];
