const secsToMins = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const convertTimeStampToDate = (date: string) =>
  new Date(date).toISOString().slice(0, 10).split("-").reverse().join(".");

const convertTimeStampToDateWithTime = (date: string) =>
  new Date(date).toISOString().slice(0, 19).replace("T", " ");

export { secsToMins, convertTimeStampToDate, convertTimeStampToDateWithTime };
