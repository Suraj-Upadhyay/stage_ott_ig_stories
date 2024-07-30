export const ReactionList = [
  "like",
  "laugh",
  "wonder",
  "clap",
  "love",
  "fire",
  "cry"
] as const;

export type ReactionType = typeof ReactionList[number];

export type StoryPostType = "image" | "video";

export type UserIdType = string;

export interface IProfile {
  userId: UserIdType;
  username: string;
  avatar: string;
  hasStories: boolean;
}

export interface IStoryPost {
  author: UserIdType;
  type: StoryPostType;
  contentURL: string;
  createdAt: Date;
  viewedBy: UserIdType[];
  reactedBy: Array<{
    userId: UserIdType;
    reaction: ReactionType;
  }>;
}

export interface IStory {
  author: UserIdType;
  stories: IStoryPost[];
}

export interface IStoryLine {
  storyForUser: UserIdType;
  stories: IStory[];
}
