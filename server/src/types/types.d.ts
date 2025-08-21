// Types of users table
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

// Types of tweets table
export type TweetIDType = string;
export type UserIDType = UserIDType;
export type ParentTweetIDType = TweetIDType | null;
export type ContentType = string;
export type ImageUrlType = string | null;
export type DeletedAt = string | null;

// Types of follows table
export type FollowersType = number;
export type FollowingType = number;

// Sesion del usuario
export type SessionID = UserIDType | null;
export type SessionIDRequeried = UserIDType;
