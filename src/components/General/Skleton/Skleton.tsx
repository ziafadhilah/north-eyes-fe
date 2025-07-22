import React from "react";

interface SkeletonBoxProps {
  className?: string;
  direction?:
    | "horizontalRight"
    | "horizontalLeft"
    | "verticalTop"
    | "verticalBottom";
}

export const SkeletonBox = ({
  className = "",
  direction = "horizontalRight",
}: SkeletonBoxProps) => {
  const getGradient = () => {
    switch (direction) {
      case "horizontalLeft":
        return "linear-gradient(270deg, transparent, rgba(255,255,255,0.2), transparent)";
      case "verticalTop":
        return "linear-gradient(0deg, transparent, rgba(255,255,255,0.2), transparent)";
      case "verticalBottom":
        return "linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)";
      case "horizontalRight":
      default:
        return "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)";
    }
  };

  const isHorizontal = direction.includes("horizontal");

  return (
    <div
      className={`relative overflow-hidden bg-gray-300/30 rounded-xl ${className}`}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: getGradient(),
          animation: isHorizontal
            ? "shimmerX 1.5s infinite linear"
            : "shimmerY 1.5s infinite linear",
          transform: isHorizontal ? "translateX(-100%)" : "translateY(-100%)",
        }}
      />
      <style jsx>{`
        @keyframes shimmerX {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes shimmerY {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
};
