"use client";
import { useCallback, useEffect, useState } from "react";
import { IoCloseSharp, IoEllipsisHorizontal } from "react-icons/io5";

interface StoryItemProps {
  showStory: () => void;
}

const StoryItem = ({ showStory }: StoryItemProps) => {
  return (
    <div className="relative inline-block h-full w-[80px] mx-1">
      <div
        onClick={showStory}
        className="centery h-[78px] w-[78px] rounded-full ig-gradient"
      >
        <div className="center h-[70px] w-[70px] rounded-full bg-white cursor-pointer"></div>
      </div>
    </div>
  );
};

interface StoryTimerProps {
  time: number;
  move: boolean;
  onComplete: () => void;
}

const StoryTimer = ({ time, move, onComplete }: StoryTimerProps) => {
  const [percentage, setPercentage] = useState(0);
  const fps = 120; // Frames per second.

  useEffect(() => {
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
  }, [move, fps, setPercentage, time]);

  useEffect(() => {
    if (percentage >= 100) onComplete();
  }, [percentage, onComplete]);

  return (
    <div className="w-full h-1 bg-white bg-opacity-50 rounded-md">
      <div
        className="h-full bg-white opacity-80 rounded-md"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

interface StoryViewProps {
  display: boolean;
  hideStory: () => void;
}

const StoryView = ({ display, hideStory }: StoryViewProps) => {
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
      {display && (
        <>
          <div className="absolute centerx top-3 w-[99%] h-1 bg-transparent">
            <StoryTimer
              move={move}
              onComplete={onComplete}
              time={storyDuration}
            />
          </div>
          <div
            onClick={hideStory}
            className="absolute top-5 right-1 text-white text-3xl"
          >
            <IoEllipsisHorizontal className="inline-block text-xl m-1" />
            <IoCloseSharp className="inline-block m-1" />
          </div>
          <div className="center w-[80%] h-[85%] bg-red-400"></div>
        </>
      )}
    </div>
  );
};

const StoryLine = () => {
  const [storyDisplay, setStoryDisplay] = useState(false);
  const showStory = () => {
    const storyView = document.querySelector(".storyview") as HTMLDivElement;
    if (storyView) {
      storyView.style.height = "100vh";
      storyView.style.width = "100vw";
      setStoryDisplay(true);
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
      <StoryView display={storyDisplay} hideStory={hideStory} />
      <StoryItem showStory={showStory} />
    </div>
  );
};

export default function Home() {
  return (
    <main className="relative h-screen w-screen bg-white">
      <div className="h-full w-full sm:w-[630px] centerx bg-black">
        <StoryLine />
      </div>
    </main>
  );
}
