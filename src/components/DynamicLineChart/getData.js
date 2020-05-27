import { random } from "lodash";
import eachDayOfInterval from "date-fns/eachDayOfInterval";

export const getDynamicLineChartData = () => {
  const start = new Date(2019, 11, 4);
  const end = new Date(2020, 11, 14);
  const valuesCount = 10;

  const data = [];

  const interval = eachDayOfInterval({ start, end });

  for (let i = 0; i < valuesCount; i++) {
    const values = [];
    for (let i = 0; i < interval.length; i++) {
      values.push({ date: interval[i], value: random(0, 444) });
    }
    data.push({ id: i, values });
  }

  return data;
};
