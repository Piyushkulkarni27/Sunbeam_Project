import { useEffect, useRef, useState } from "react";

const STORIES = [
  {
    type: "image",
    duration: 5000,
    // paste your full base64 string here if you want
    src: "https://via.placeholder.com/450x800?text=Story+1",
    avatar: "/ashwin_1.jpg",
    user: "user1",
  },
  {
    type: "video",
    duration: 5000,
    src: "/gif.mp4",
    avatar: "/ashwin.jpg",
    user: "user2",
  },
  {
    type: "image",
    duration: 5000,
    src: "https://via.placeholder.com/450x800?text=Story+3",
    avatar: "https://via.placeholder.com/40",
    user: "user3",
  },
];

export default function StoriesPage() {
  const [current, setCurrent] = useState(0);
  const [segment, setSegment] = useState(0);
  const intervalRef = useRef(null);
  const videoRef = useRef(null);
  const totalSegments = 3; // 3 small progress bars

  useEffect(() => {
    startStory();
    const handler = (e) => {
      if (e.key === "ArrowRight") nextStory();
      if (e.key === "ArrowLeft") prevStory();
    };
    window.addEventListener("keydown", handler);
    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("keydown", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const startStory = () => {
    clearInterval(intervalRef.current);
    setSegment(0);

    const story = STORIES[current];
    const segDuration = story.duration / totalSegments;

    if (story.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }

    intervalRef.current = setInterval(() => {
      setSegment((prev) => {
        if (prev + 1 >= totalSegments) {
          clearInterval(intervalRef.current);
          nextStory();
          return prev;
        }
        return prev + 1;
      });
    }, segDuration);
  };

  const nextStory = () => {
    if (current < STORIES.length - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const prevStory = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
    }
  };

  const story = STORIES[current];

  return (
    <div className="w-screen h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-[450px] h-screen bg-black">
        {story.type === "image" ? (
          <img
            src={story.src}
            alt="Story"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={story.src}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
          />
        )}

        <div className="absolute top-2 left-2 right-2 flex gap-1">
          {Array.from({ length: totalSegments }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 bg-white/30 rounded overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all"
                style={{
                  width:
                    i < segment
                      ? "100%"
                      : i === segment
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-10 left-5 flex items-center">
          <img
            src={story.avatar}
            alt="User"
            className="w-10 h-10 rounded-full mr-2"
          />
          <span className="text-base font-medium">{story.user}</span>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
          <input
            type="text"
            placeholder="Reply to story..."
            className="flex-1 border-none px-3 py-2 rounded-full bg-white/30 text-white text-sm outline-none placeholder:text-gray-200"
          />
          <button className="ml-3 text-2xl leading-none">➤</button>
        </div>

        <button
          className="absolute top-0 left-0 h-full w-1/2 cursor-pointer bg-transparent"
          onClick={prevStory}
        />
        <button
          className="absolute top-0 right-0 h-full w-1/2 cursor-pointer bg-transparent"
          onClick={nextStory}
        />
      </div>
    </div>
  );
}
