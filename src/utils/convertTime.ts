const secsToMins = (seconds: number) => {
  return `${(seconds / 60).toFixed()}:${
    (seconds % 60).toFixed().length == 1
      ? "0" + (seconds % 60).toFixed()
      : (seconds % 60).toFixed()
  }`;
};

const convertTimeStampToDate = (date: string) =>
  new Date(date).toISOString().slice(0, 10).split("-").reverse().join(".");

const convertTimeStampToDateWithTime = (date: string) =>
  new Date(date).toISOString().slice(0, 19).replace("T", " ");

export { secsToMins, convertTimeStampToDate, convertTimeStampToDateWithTime };
