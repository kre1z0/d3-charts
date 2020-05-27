import { random } from "lodash";
import eachDayOfInterval from "date-fns/eachDayOfInterval";

export const getDynamicLineChartData = ({ linesCount = 4, start, end }) => {
  const data = [];

  const interval = eachDayOfInterval({ start, end });

  for (let i = 0; i < linesCount; i++) {
    const values = [];
    for (let i = 0; i < interval.length; i++) {
      values.push({ date: interval[i], value: random(40, 74) });
    }
    data.push({ id: i, values });
  }

  return data;
};
