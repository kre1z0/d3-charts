import { random, orderBy, map } from "lodash";

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
