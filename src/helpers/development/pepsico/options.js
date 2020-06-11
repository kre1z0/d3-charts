export function getScuOptions(data) {
  return Object.keys(data).map((key) => ({ text: data[key][0].name, value: data[key][0].net_id }));
}
