import parse from "new-date-fns/parse";

export const normalizeData = (data) => {
  if (data) {
    return data.map(({ date }) => ({
      date: parse(date, "yyyy-MM-dd", new Date()),
    }));
  }
};
