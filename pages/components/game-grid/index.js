import { useState, useEffect } from "react";

const Piece = ({ piece, type, index, canPlay, onSelect }) => {
  const visible = piece.state !== "HIDDEN";

  const bgColor = visible
    ? "border-indigo-900 border-4 bg-yellow-100"
    : canPlay
    ? "bg-green-300"
    : "bg-gray-500";

  const fontSize = type === "NUM" ? "text-lg" : "text-2xl";
  const handleClick = () => {
    onSelect({ piece, index });
  };

  return (
    <button
      disabled={piece.state === "OPEN" || !canPlay}
      onClick={handleClick}
      className={`rounded-full w-12 h-12 md:w-16 md:h-16 p-4 m-1 font-bold ${bgColor} ${fontSize}`}
    >
      {visible ? piece.value : ""}
    </button>
  );
};

const setPieceState = (array, indices, state) => {
  indices.forEach((index) => {
    array[index] = { ...array[index], state };
  });
  return array;
};

export const GameGrid = ({ canPlay, pieces, onSwitchTurn, onToggle }) => {
  const [gamePieces, setPieces] = useState(pieces.slice());
  const [selected, setSelected] = useState(null);

  const onSelect = ({ piece, index, switchTurn }) => {
    const newPieces = pieces.slice(0);
    if (!selected) {
      setSelected({ piece, index });
      const updated = setPieceState(newPieces, [index], "OPEN");
      onToggle(updated);
      setPieces(updated);
    } else if (selected.piece.value === piece.value) {
      const updated = setPieceState(newPieces, [index, selected.index], "OPEN");
      setPieces(updated);
      onSwitchTurn(updated);
      setSelected(null);
    } else {
      const updated = setPieceState(newPieces, [index], "OPEN");
      setPieces(updated);
      onToggle(updated);
      setTimeout(() => {
        const resetPieces = pieces.slice(0);
        const reset = setPieceState(
          resetPieces,
          [index, selected.index],
          "HIDDEN"
        );
        setPieces(reset);
        onSwitchTurn(reset);
        setSelected(null);
      }, 500);
    }
  };

  useEffect(() => {
    setPieces(pieces);
  }, [pieces]);

  return (
    <div
      className={`grid ${
        gamePieces.length === 6 ? "grid-cols-6" : "grid-cols-4"
      } justify-items-center justify-center content-center mt-6 w-full lg:w-1/2`}
    >
      {gamePieces.map((piece, index) => {
        return (
          <Piece
            key={index}
            onSelect={onSelect}
            piece={piece}
            index={index}
            canPlay={canPlay}
          />
        );
      })}
    </div>
  );
};

export default GameGrid;
