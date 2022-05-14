import { useState, useEffect } from "react";

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

const createPieces = (size, type) => {
  const matches =
    type === "NUM"
      ? new Array(size).fill(0).map(() => ({
          value: randomInt(),
          state: "HIDDEN",
        }))
      : getSymbolArray(size);
  console.log({ matches });
  const pieces = [...matches, ...matches];
  return shuffle(pieces);
};

const Piece = ({ piece, type, index, onSelect }) => {
  const visible = piece.state !== "HIDDEN";

  const bgColor = visible
    ? "border-indigo-900 border-4 bg-yellow-100"
    : "bg-green-300";

  const fontSize = type === "NUM" ? "text-lg" : "text-2xl";
  const handleClick = () => {
    onSelect({ piece, index });
  };

  return (
    <button
      disabled={piece.state === "OPEN"}
      onClick={handleClick}
      className={`rounded-full w-12 h-12 md:w-16 md:h-16 p-4 m-1 font-bold ${bgColor} ${fontSize}`}
    >
      {visible ? piece.value : ""}
    </button>
  );
};

const setOpen = (array, index) => {
  array[index] = { ...array[index], state: "OPEN" };
  return array;
};

const setHidden = (array, index) => {
  array[index] = { ...array[index], state: "HIDDEN" };
  return array;
};

export const GameGrid = ({ size, type }) => {
  console.log(size);
  const [pieces, setPieces] = useState([]);
  const [selected, setSelected] = useState(null);

  const onSelect = ({ piece, index }) => {
    const newPieces = pieces.slice(0);
    if (!selected) {
      setSelected({ piece, index });
      setPieces(setOpen(newPieces, index));
    } else if (selected.piece.value === piece.value) {
      setPieces(setOpen(setOpen(newPieces, index), selected.piece.index));
      setSelected(null);
    } else {
      setPieces(setOpen(newPieces, index));
      setTimeout(() => {
        const resetPieces = pieces.slice(0);
        setPieces(setHidden(setHidden(resetPieces, index), selected.index));
        setSelected(null);
      }, 500);
    }
  };
  useEffect(() => {
    setPieces(createPieces(size, type));
  }, [size, type]);

  return (
    <div
      className={`grid ${
        size === 18 ? "grid-cols-6" : "grid-cols-4"
      } justify-items-center justify-center content-center mt-6 w-full lg:w-1/2`}
    >
      {pieces.map((piece, index) => {
        return (
          <Piece key={index} onSelect={onSelect} piece={piece} index={index} />
        );
      })}
    </div>
  );
};

export default GameGrid;
