const symbols = "!@#$%^&*()~{}[]+><|?";

const randomInt = () => {
  return Math.ceil(Math.random() * 100) + 5;
};

const randomSym = () => {
  const index = Math.floor(Math.random() * symbols.length);
  return symbols[index];
};

const getSymbolArray = (size) => {
  const list = new Set();

  while (list.size !== size) {
    list.add(randomSym());
  }

  return [...list].map((value) => ({ value, state: "HIDDEN" }));
};
const shuffle = (array) => {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

export const createPieces = (size, type) => {
  const matches =
    type === "NUM"
      ? new Array(size).fill(0).map(() => ({
          value: randomInt(),
          state: "HIDDEN",
        }))
      : getSymbolArray(size);
  const pieces = [...matches, ...matches];
  return shuffle(pieces);
};
