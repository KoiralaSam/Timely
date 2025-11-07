import { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };
  //text-4xl font-mono bg-gray-900 text-white px-6 py-2 rounded-lg shadow-md
  return (
    <div className="h-20 flex items-center justify-center bg-gray-900 text-white">
      <div className="text-4xl font-mono px-6 py-2 bg-gray-900 rounded-b-lg shadow-lg">
        {formatTime(time)}
      </div>
    </div>
  );
};

export default Clock;
