export const formatDuration = (totalSeconds) => {
  if (!totalSeconds || isNaN(totalSeconds)) return "0s";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const h = hours > 0 ? `${hours}h ` : "";
  const m = minutes > 0 ? `${minutes}m ` : "";
  const s = seconds > 0 ? `${seconds}s` : "";

  return `${h}${m}${s}`.trim() || "0s";
};
