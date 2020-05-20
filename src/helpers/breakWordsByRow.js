export const breakWordsByRow = (text, lineLimit = 2) => {
  if (lineLimit === 1) {
    return [text];
  }

  const sliceLabel = text.slice(0).split(" ");

  let charactersLimit = 0;
  sliceLabel.forEach((word) => {
    charactersLimit += word.length;
  });
  charactersLimit += sliceLabel.length;
  charactersLimit = Math.round(charactersLimit / lineLimit);

  const labels = [[]];
  let currStringlength = 0;
  let countRow = 0;

  sliceLabel.forEach((word) => {
    if (currStringlength + word.length < charactersLimit && labels.length !== lineLimit) {
      labels[countRow].push(word);
    } else {
      if (countRow + 1 < lineLimit) {
        countRow += 1;
        currStringlength = 0;
        labels.push([]);
      }
      labels[countRow].push(word);
    }
    currStringlength += word.length;
  });
  const joinsLabels = [];
  labels.forEach((line, index) => {
    joinsLabels.push(line);
    if (index + 1 === lineLimit) {
      const prevLine = labels[index - 1].join(" ");
      const lastLine = line.join(" ");
      if (prevLine.length * 2 < lastLine.length && line[0]) {
        const firstWord = joinsLabels[index].shift();
        joinsLabels[index - 1].push(firstWord);
      }
    }
  });

  return joinsLabels.map((line) => line.join(" "));
};
