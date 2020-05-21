import { random, orderBy, map, reverse } from "lodash";

import horizontalBarChartData from "assets/horizontalBarChartData";

const randomData = ({ length, count = 1, from = 0, to = 100 }) => {
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push(Array.from({ length }, (_) => random(from, to)));
  }

  return data;
};

export const lineChartRandomData = () => randomData({ length: 10, count: 2, from: -200, to: 400 });

export const stackedBarChartRandomData = () => {
  const names = [
    "Численность населения",
    "ВГП на дущу населения",
    "ВГП",
    "Доходы бюджетов",
    "Прибыль предприятий",
    "Инвестиции",
    "Жилобеспеченность",
  ];

  return names.map((name) => {
    const upper = 100;
    const r = random(-40, upper);
    return {
      name,
      inertial: r,
      scenario: upper - r,
    };
  });
};

export const horizontalBarChartRandomData = () => {
  const shuffled = horizontalBarChartData.sort(() => 0.5 - Math.random());

  const data = orderBy(shuffled.slice(0, 20), "rating", "desc");
  return data;
};

export const percentBarChartRandomData = () => {
  const years = [2020, 2019, 2018, 2017];
  const ranges = {
    1: [10, 17],
    2: [2, 8],
    3: [2, 6],
    4: [2, 5],
    5: [3, 6],
    6: [7, 8],
    7: [4, 5],
    8: [3, 6],
    9: [5, 10],
    10: [3, 6],
  };

  return years.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: Array.from({ length: 10 }).reduce((acc, curr, index, array) => {
        acc.push(random(...ranges[index + 1]));
        if (index === array.length - 1) {
          const sum = acc.reduce((acc, curr) => acc + curr, 0);
          acc.push(100 - sum);
        }
        return acc;
      }, []),
    }),
    {},
  );
};
