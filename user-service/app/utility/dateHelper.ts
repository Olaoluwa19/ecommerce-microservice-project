import dayjs from "dayjs";

export const TimeDifference = (
  fromDate: string,
  toDate: string,
  type: "d" | "h" | "m"
) => {
  try {
    const startDate = dayjs(fromDate);
    return startDate.diff(dayjs(toDate), type, true);
  } catch (error) {
    throw new Error(error);
  }
};
