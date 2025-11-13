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
  return (
    <div className="flex items-center justify-center">
      <div className="text-3xl font-light text-gray-900 tracking-wide">
        {formatTime(time)}
      </div>
    </div>
  );
};

export default Clock;
