import { groupBy } from "lodash";
import parse from "date-fns/parse";
import format from "date-fns/format";
import eachDayOfInterval from "date-fns/eachDayOfInterval";

const formatString = "yyyy-MM-dd";

export const normalizeData = (data) => {
  const grouped = groupBy(data, "net_id");
  const groups = Object.keys(grouped);
  let start = +new Date();
  let end = +new Date();
  const groupedByDate = {};

  for (let i = 0; i < groups.length; i++) {
    const group = grouped[groups[i]];

    groupedByDate[groups[i]] = groupBy(grouped[groups[i]], "FIELD1");

    for (let i = 0; i < group.length; i++) {
      const item = group[i];
      const { FIELD1 } = item;
      const date = parse(FIELD1, formatString, new Date());
      item.parsedDate = date;

      start = Math.min(start, +date);
      end = Math.max(start, +date);
    }
  }

  const dayInterval = eachDayOfInterval({ start, end }).map((date) => format(date, "yyyy-MM-dd"));

  const normalizedData = [];

  const groupedByDateKeys = Object.keys(groupedByDate);

  for (let i = 0; i < groupedByDateKeys.length; i++) {
    const group = groupedByDate[groupedByDateKeys[i]];
    const id = groupedByDateKeys[i];
    const values = [];

    let prevValue = 40;
    for (let i = 0; i < dayInterval.length; i++) {
      const day = dayInterval[i];
      const groupDay = group[day];
      const parsedDate = parse(day, formatString, new Date());

      if (groupDay) {
        const { price } = groupDay[0];

        const normalizePrice = price.includes(",") ? +price.replace(",", ".") : +price;

        prevValue = normalizePrice;
        values.push({
          date: parsedDate,
          value: normalizePrice,
        });
      } else {
        values.push({
          date: parsedDate,
          value: prevValue,
        });
      }
    }

    normalizedData.push({
      id,
      values,
    });
  }

  return { start, end, data: normalizedData || [] };
};
