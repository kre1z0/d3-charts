import { random } from "lodash";
import eachDayOfInterval from "date-fns/eachDayOfInterval";

export const getDynamicLineChartData = ({ linesCount = 4, start, end }) => {
  const data = [];

  const interval = eachDayOfInterval({ start, end });

  for (let i = 0; i < linesCount; i++) {
    const values = [];
    for (let i = 0; i < interval.length; i++) {
      const prevValue = values[i - 1] ? values[i - 1].value : null;
      const randomValue = i === 0 ? random(40, 74) : random(prevValue - 1, prevValue + 1);

      values.push({ date: interval[i], value: randomValue });
    }
    data.push({ id: i, values });
  }

  return data;
};
