import { useRef } from "react";

export default function Background() {
  const stars = useRef(
    Array.from({ length: 50 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      opacity: Math.random() * 0.5 + 0.3,
    }))
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.current.map((star, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={star}
        />
      ))}
    </div>
  );
}
