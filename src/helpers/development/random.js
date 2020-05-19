import { random } from "lodash";

const randomData = ({ length, count = 1, from = 0, to = 100 }) => {
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push(Array.from({ length }, (_) => random(from, to)));
  }

  return data;
};

export const lineChartRandomData = () => randomData({ length: 10, count: 2, from: -200, to: 400 });

export const barChartRandomData = () => {
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
    const d = 140;
    const r = random(-20, 120);
    return {
      name,
      inertial: r,
      scenario: d - r,
    };
  });
};
