export function getScuOptions(data) {
  return data.map((product, index) => ({ text: product[0].name, value: index.toString() }));
}
