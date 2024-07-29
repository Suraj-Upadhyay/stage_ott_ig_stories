import { faker } from "@faker-js/faker";
import {
  IProfile,
  IStory,
  IStoryLine,
  IStoryPost,
  ReactionList,
  ReactionType,
  StoryPostType
} from "@/models/data.model";

function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    avatar: faker.image.avatar(),
    hasStories: [true, false][Math.floor(Math.random() * 2)]
  };
}

const profileData: Array<IProfile> = [];
const stories: Array<IStory> = [];
let storyLine: IStoryLine;

for (let i = 0; i < 10; i++) profileData.push(createRandomUser());

function getRandomElement<T>(array: Array<T>) {
  const length = array.length;
  return array[Math.floor(Math.random() * length)];
}

function getRandomElements<T>(array: Array<T>, len: number) {
  let shuffled = array.slice(0),
    i = array.length,
    temp,
    index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, len);
}

function getRandomDate() {
  const startDate = new Date();
  const endDate = new Date();

  startDate.setDate(startDate.getDate() - 1);

  return new Date(
    startDate.getTime() +
      Math.random() * (endDate.getTime() - endDate.getTime())
  );
}

function getRandomImageURL() {
  const widthArray = [300, 400, 500, 600, 700, 800, 900];
  const heightArray = [300, 400, 500, 600, 700, 800, 900];
  const width = getRandomElement(widthArray);
  const height = getRandomElement(heightArray);
  return `https://picsum.photos/${width}/${height}`;
}

function getRandomViewers(): string[] {
  const numOfViewers = Math.floor(Math.random() * 10);
  return getRandomElements(profileData, numOfViewers).map(
    viewer => viewer.userId
  );
}

function createStoryPosts(userId: string) {
  const type: StoryPostType = "image";
  const viewerIds = getRandomViewers();
  const reactions = viewerIds.map(viewer => {
    return {
      userId: viewer,
      reaction: getRandomElement<ReactionType>(
        (ReactionList as unknown) as ReactionType[]
      )
    };
  });
  return {
    author: userId,
    type: type,
    contentURL: getRandomImageURL(),
    createdAt: getRandomDate(),
    viewedBy: viewerIds,
    reactedBy: reactions
  } as IStoryPost;
}

function createProfileStories(userId: string) {
  const MAX_STORY_PER_USER = 5;
  const numOfStoryPosts = Math.floor(Math.random() * MAX_STORY_PER_USER);
  const profileStories: IStoryPost[] = [];
  for (let i = 0; i < numOfStoryPosts; i++)
    profileStories.push(createStoryPosts(userId));
  return profileStories;
}

profileData.filter(profile => profile.hasStories).forEach(profile => {
  stories.push({
    author: profile.userId,
    stories: createProfileStories(profile.userId)
  });
});

storyLine = {
  storyForUser: getRandomElement(profileData).userId,
  stories: stories
};

export { storyLine };
