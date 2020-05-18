import { random } from "lodash";

export const randomData = ({ length, count = 1, from = 0, to = 100 }) => {
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push(Array.from({ length }, (_) => random(from, to)));
  }

  return data;
};
