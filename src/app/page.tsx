"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoCloseSharp, IoEllipsisHorizontal } from "react-icons/io5";
import { profileData, storyLine } from "./data";
import { IStory, IStoryLine } from "@/models/data.model";

function getProfilePicForUser(userId: string) {
  return profileData.filter((profile) => profile.userId === userId)[0].avatar;
}

interface ProfileStoryItemProps {
  index: number;
  storyData: IStory;
  showStory: (userIndex: number) => void;
}

const ProfileStoryItem = ({
  index,
  showStory,
  storyData
}: ProfileStoryItemProps) => {
  return (
    <div className="relative inline-block h-full w-[80px] mx-1">
      <div
        onClick={() => showStory(index)}
        className="centery h-[78px] w-[78px] rounded-full ig-gradient"
      >
        <div
          className="center h-[70px] w-[70px] rounded-full bg-white cursor-pointer"
          style={{
            backgroundImage: `url(${getProfilePicForUser(storyData.author)})`
          }}
        ></div>
      </div>
    </div>
  );
};

interface StoryTimerProps {
  index: number;
  active: number;
  onForward: () => void;
  width: number; // percentage
  time: number;
  move: boolean;
}

const StoryTimer = ({
  index,
  active,
  onForward,
  width,
  time,
  move
}: StoryTimerProps) => {
  const [percentage, setPercentage] = useState(0);
  const fps = 120; // Frames per second.

  useEffect(() => {
    console.log("index: ", index, " active: ", active);
    if (index !== active) return;
    let intervalId: NodeJS.Timeout | number | undefined;
    if (move && intervalId === undefined) {
      intervalId = setInterval(
        () =>
          setPercentage((prev) => {
            return prev + (1000 * 100) / time / fps;
          }),
        1000 / fps
      );
    } else if (intervalId) {
      clearInterval(intervalId);
    }
    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [move, fps, setPercentage, time, index, active]);

  useEffect(() => {
    if (percentage >= 100) onForward();
  }, [percentage, onForward]);

  return (
    <div
      className="inline-block h-1 bg-white bg-opacity-50 rounded-md m-[0.5px]"
      style={{ width: `${width}%` }}
    >
      <div
        className="h-full bg-white opacity-80 rounded-md"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

interface StoryViewItemProps {
  stories: IStory;
  move: boolean;
  onComplete: () => void;
  storyDuration: number;
}

const StoryViewItem = ({
  stories,
  move,
  onComplete,
  storyDuration
}: StoryViewItemProps) => {
  const [activeStory, setActiveStory] = useState(0);
  const numOfStories = stories.stories.length;

  const onStoryForward = () => {
    console.log("onForward called");
    if (activeStory === numOfStories - 1) {
      onComplete();
      return;
    }
    setActiveStory((prev) => prev + 1);
  };

  const onStoryBackward = () => {
    if (activeStory === 0) {
      onComplete();
      return;
    }
    setActiveStory((prev) => prev - 1);
  };

  console.log("numOfStories: ", numOfStories);

  return (
    <>
      <div className="absolute centerx top-1 w-[99%] h-1 bg-transparent">
        {[...Array(numOfStories).keys()].map((_, idx) => (
          <StoryTimer
            key={idx}
            index={idx}
            active={activeStory}
            onForward={onStoryForward}
            width={100 / numOfStories}
            move={move}
            time={storyDuration}
          />
        ))}
      </div>
      <div className="center w-[80%] h-[85%] bg-red-400"></div>
    </>
  );
};

interface StoryViewProps {
  storyLine: IStoryLine;
  userStoryIndex: number;
  display: boolean;
  hideStory: () => void;
}

const StoryView = ({
  userStoryIndex,
  storyLine,
  display,
  hideStory
}: StoryViewProps) => {
  const [move, setMove] = useState(true);
  const storyDuration = 5000;

  const onComplete = useCallback(() => {
    setMove(false);
  }, []);

  useEffect(() => {
    if (display) setMove(true);
  }, [display, setMove]);

  return (
    <div className="z-10 absolute top-0 left-0 w-0 h-0 bg-black transition-all storyview">
      <div className="absolute top-5 right-1 text-white text-3xl">
        <IoEllipsisHorizontal className="inline-block text-xl m-1" />
        <IoCloseSharp onClick={hideStory} className="inline-block m-1" />
      </div>
      {display && (
        <StoryViewItem
          stories={storyLine.stories[userStoryIndex]}
          move={move}
          onComplete={onComplete}
          storyDuration={storyDuration}
        />
      )}
    </div>
  );
};

interface StoryLineProps {
  storyLineData: IStoryLine;
}

const StoryLine = ({ storyLineData }: StoryLineProps) => {
  const [userStoryIndex, setUserStoryIndex] = useState(-1);
  const [storyDisplay, setStoryDisplay] = useState(false);
  const showStory = (userIndex: number) => {
    const storyView = document.querySelector(".storyview") as HTMLDivElement;
    if (storyView) {
      storyView.style.height = "100vh";
      storyView.style.width = "100vw";
      setStoryDisplay(true);
      setUserStoryIndex(userIndex);
    }
  };

  const hideStory = () => {
    const storyView = document.querySelector(".storyview") as HTMLDivElement;
    if (storyView) {
      storyView.style.height = "0px";
      storyView.style.width = "0px";
      setStoryDisplay(false);
    }
  };

  return (
    <div className="w-full h-[100px] bg-black text-nowrap overflow-x-auto overflow-y-hidden p-1">
      <StoryView
        storyLine={storyLineData}
        display={storyDisplay}
        userStoryIndex={userStoryIndex}
        hideStory={hideStory}
      />
      {storyLineData.stories.map((story, idx) => (
        <ProfileStoryItem
          key={idx}
          index={idx}
          showStory={showStory}
          storyData={story}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const storyLineData = useMemo(() => storyLine, []);
  return (
    <main className="relative flex justify-center h-screen w-screen bg-black">
      <div className="h-full w-full sm:w-[630px] bg-black">
        <StoryLine storyLineData={storyLineData} />
      </div>
    </main>
  );
}
